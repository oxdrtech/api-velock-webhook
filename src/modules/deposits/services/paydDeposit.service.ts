import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DEPOSITS_SERVICE_TOKEN } from '../utils/depositsServiceToken';
import { IDepositsRepositories } from '../domain/repositories/IDeposits.repositories';
import { Deposit, PlayerStatus } from '@prisma/client';
import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';
import { PaydDepositEventDto } from '../domain/dto/payd-deposit-event.dto';
import { UpdateDepositDto } from '../domain/dto/update-deposit.dto';
import { UpdatePlayerDto } from 'src/modules/players/domain/dto/update-player.dto';
import { DepositsListener } from 'src/modules/socket/infra/listeners/deposits.listener';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/players/utils/playersServiceToken';

@Injectable()
export class PaydDepositService {
  constructor(
    @Inject(DEPOSITS_SERVICE_TOKEN)
    private readonly depositsRepositories: IDepositsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
    private readonly depositsListener: DepositsListener,
  ) { }

  async execute(data: PaydDepositEventDto): Promise<Deposit> {
    const { data: depositData } = data;
    const [playerExternalIdExisting, depositTransactionIdExisting] = await Promise.all([
      this.playersRepositories.findPlayerByExternalId(depositData.userId),
      this.depositsRepositories.findDepositByTransactionId(depositData.id),
    ]);

    if (!playerExternalIdExisting) throw new NotFoundException('Player não existe');
    if (!depositTransactionIdExisting) throw new NotFoundException('Depósito não existe');

    const updatedPlayerData: UpdatePlayerDto = {
      balance: (playerExternalIdExisting.balance ?? 0) + (depositData.amount ?? 0),
      firstDepositDate: playerExternalIdExisting.firstDepositDate ?? new Date(),
      firstDepositValue: playerExternalIdExisting.firstDepositValue ?? depositData.amount ?? 0,
      lastDepositDate: new Date(),
      lastDepositValue: depositData.amount ?? playerExternalIdExisting.lastDepositValue ?? 0,
      totalDepositCount: (playerExternalIdExisting.totalDepositCount ?? 0) + 1,
      totalDepositValue: (playerExternalIdExisting.totalDepositValue ?? 0) + (depositData.amount ?? 0),
      playerStatus: PlayerStatus.ACTIVE,
    };

    await this.playersRepositories.updatePlayer(playerExternalIdExisting.id, updatedPlayerData);

    const updateDepositData: UpdateDepositDto = {
      transactionId: depositData.id,
      amount: depositData.amount,
      currency: depositData.currency,
      date: depositData.date ?? depositTransactionIdExisting.date,
      depositStatus: "APPROVED",
      isFirstTime: depositData.isFirstTime,
      method: depositData.method ?? depositTransactionIdExisting.method,
    };

    const paydDeposit = await this.depositsRepositories.paydDeposit(depositTransactionIdExisting.id, updateDepositData);

    this.depositsListener.emitDepositPayd(paydDeposit);

    return paydDeposit;
  }
}
