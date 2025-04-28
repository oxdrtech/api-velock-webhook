import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DEPOSITS_SERVICE_TOKEN } from '../utils/depositsServiceToken';
import { IDepositsRepositories } from '../domain/repositories/IDeposits.repositories';
import { CreateDepositDto } from '../domain/dto/create-deposit.dto';
import { Deposit, LogStatus, LogType } from '@prisma/client';
import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';
import { CreateDepositEventDto } from '../domain/dto/create-deposit-event.dto';
import { DepositsListener } from 'src/modules/socket/infra/listeners/deposits.listener';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/players/utils/playersServiceToken';
import { CreateLogService } from 'src/modules/logs/services/createLog.service';

@Injectable()
export class CreateDepositService {
  constructor(
    @Inject(DEPOSITS_SERVICE_TOKEN)
    private readonly depositsRepositories: IDepositsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
    private readonly depositsListener: DepositsListener,
    private readonly createLogService: CreateLogService,
  ) { }

  async execute(data: CreateDepositEventDto): Promise<Deposit> {
    try {
      const { data: depositData } = data;
      const [playerExternalIdExisting, depositTransactionIdExists] = await Promise.all([
        this.playersRepositories.findPlayerByExternalId(depositData.userId),
        this.depositsRepositories.findDepositByTransactionId(depositData.id),
      ]);

      if (depositTransactionIdExists) throw new BadRequestException('Já existe um deposito com esse ID de transação');

      let player = playerExternalIdExisting;
      if (!player) {
        player = await this.playersRepositories.createPlayer({
          externalId: depositData.userId,
          tenantId: depositData.tenantId,
          name: depositData.name,
          email: depositData.email || "",
          phone: depositData.phone,
        })
      }

      const depositAmountInCents = Math.round(depositData.amount * 100);

      const updateDepositData: CreateDepositDto = {
        transactionId: depositData.id,
        amount: depositAmountInCents,
        method: depositData.method,
        date: depositData.date,
        currency: depositData.currency,
        playerId: player.id,
      };

      const createdDeposit = await this.depositsRepositories.createDeposit(updateDepositData);
      const updatedPlayer = await this.playersRepositories.findPlayerByExternalId(depositData.userId);

      this.depositsListener.emitDepositCreated(createdDeposit, updatedPlayer);

      // await this.createLogService.execute({
      //   logStatus: LogStatus.SUCCESS,
      //   logType: LogType.DEPOSIT_CREATED,
      //   message: 'Depósito criado com sucesso',
      //   payload: createdDeposit,
      //   entityId: createdDeposit.id,
      // });

      return createdDeposit;
    } catch (error) {
      await this.createLogService.execute({
        logStatus: LogStatus.FAILED,
        logType: LogType.DEPOSIT_CREATED,
        message: error.message,
        payload: { input: data },
      });
    }
  }
}
