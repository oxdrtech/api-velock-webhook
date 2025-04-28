import { Inject, Injectable } from '@nestjs/common';
import { DEPOSITS_SERVICE_TOKEN } from '../utils/depositsServiceToken';
import { IDepositsRepositories } from '../domain/repositories/IDeposits.repositories';
import { Deposit, LogStatus, LogType, PlayerStatus } from '@prisma/client';
import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';
import { PaydDepositEventDto } from '../domain/dto/payd-deposit-event.dto';
import { UpdateDepositDto } from '../domain/dto/update-deposit.dto';
import { UpdatePlayerDto } from 'src/modules/players/domain/dto/update-player.dto';
import { DepositsListener } from 'src/modules/socket/infra/listeners/deposits.listener';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/players/utils/playersServiceToken';
import { CreateLogService } from 'src/modules/logs/services/createLog.service';

@Injectable()
export class PaydDepositService {
  constructor(
    @Inject(DEPOSITS_SERVICE_TOKEN)
    private readonly depositsRepositories: IDepositsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
    private readonly depositsListener: DepositsListener,
    private readonly createLogService: CreateLogService,
  ) { }

  async execute(data: PaydDepositEventDto): Promise<Deposit> {
    try {
      const { data: depositData } = data;
      const [playerExternalIdExisting, depositTransactionIdExisting] = await Promise.all([
        this.playersRepositories.findPlayerByExternalId(depositData.userId),
        this.depositsRepositories.findDepositByTransactionId(depositData.id),
      ]);

      let player = playerExternalIdExisting;
      let deposit = depositTransactionIdExisting;

      if (!player) {
        const ramdomSuffix1 = Math.floor(Math.random() * 1000000);
        const ramdomSuffix2 = Math.floor(Math.random() * 1000000);
        const fakeEmail = `sem-email-${ramdomSuffix1}-${ramdomSuffix2}@hotmail.com`
        player = await this.playersRepositories.createPlayer({
          externalId: depositData.userId,
          tenantId: depositData.tenantId,
          name: depositData.name,
          email: depositData.email || fakeEmail,
          phone: depositData.phone,
          balance: 0,
        });
      }

      if (!deposit) {
        deposit = await this.depositsRepositories.createDeposit({
          transactionId: depositData.id,
          amount: Math.round(depositData.amount * 100),
          currency: depositData.currency,
          method: depositData.method,
          date: depositData.date,
          playerId: player.id,
        });
      }

      const depositAmountInCents = Math.round(depositData.amount * 100);

      const updatedPlayerData: UpdatePlayerDto = {
        balance: (player.balance ?? 0) + depositAmountInCents,
        firstDepositDate: player.firstDepositDate ?? new Date(),
        firstDepositValue: player.firstDepositValue ?? depositAmountInCents,
        lastDepositDate: new Date(),
        lastDepositValue: depositAmountInCents ?? player.lastDepositValue ?? 0,
        totalDepositCount: (player.totalDepositCount ?? 0) + 1,
        totalDepositValue: (player.totalDepositValue ?? 0) + depositAmountInCents,
        playerStatus: PlayerStatus.ACTIVE,
      };

      await this.playersRepositories.updatePlayer(player.id, updatedPlayerData);

      const updateDepositData: UpdateDepositDto = {
        transactionId: depositData.id,
        amount: depositAmountInCents,
        currency: depositData.currency ?? deposit.currency,
        date: depositData.date ?? deposit.date,
        depositStatus: "APPROVED",
        isFirstTime: depositData.isFirstTime,
        method: depositData.method ?? deposit.method,
      };

      const paydDeposit = await this.depositsRepositories.paydDeposit(deposit.id, updateDepositData);
      const updatedPlayer = await this.playersRepositories.findPlayerByExternalId(depositData.userId);

      this.depositsListener.emitDepositPayd(paydDeposit, updatedPlayer);

      // await this.createLogService.execute({
      //   logStatus: LogStatus.SUCCESS,
      //   logType: LogType.DEPOSIT_PAID,
      //   message: 'Depósito pago com sucesso',
      //   payload: paydDeposit,
      //   entityId: paydDeposit.id,
      // });

      return paydDeposit;
    } catch (error) {
      await this.createLogService.execute({
        logStatus: LogStatus.FAILED,
        logType: LogType.DEPOSIT_PAID,
        message: error.message,
        payload: { input: data },
      });
    }
  }
}
