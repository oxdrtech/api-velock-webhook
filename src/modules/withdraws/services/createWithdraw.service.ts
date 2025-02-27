import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WITHDRAW_SERVICE_TOKEN } from '../utils/withdrawsServiceToken';
import { IWithdrawsRepositories } from '../domain/repositories/IWithdraw.repositories';
import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';
import { CreateWithdrawDto } from '../domain/dto/create-withdraw.dto';
import { Withdraw } from '@prisma/client';
import { UpdatePlayerDto } from 'src/modules/players/domain/dto/update-player.dto';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/logins/utils/playersServiceToken';
import { CreateWithdrawEventDto } from '../domain/dto/create-withdraw-event.dto';
import { WithdrawsListener } from 'src/modules/socket/infra/listeners/withsraws.listener';

@Injectable()
export class CreateWithdrawService {
  constructor(
    @Inject(WITHDRAW_SERVICE_TOKEN)
    private readonly withdrawsRepositories: IWithdrawsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
    private readonly withdrawsListener: WithdrawsListener,
  ) { }

  async execute(data: CreateWithdrawEventDto): Promise<Withdraw> {
    const { data: withdrawData } = data;
    const [playerExternalIdExisting, withdrawIdExisting] = await Promise.all([
      this.playersRepositories.findPlayerByExternalId(withdrawData.userId),
      this.withdrawsRepositories.findWithdrawByTransactionId(withdrawData.id),
    ]);

    if (!playerExternalIdExisting) throw new NotFoundException('Player não existe');
    if (withdrawIdExisting) throw new BadRequestException('Esse saque já foi registrado');

    const updatePlayerData: UpdatePlayerDto = {
      balance: (playerExternalIdExisting.balance ?? 0) - (withdrawData.amount ?? 0),
      lastWithdrawalDate: new Date(),
      lastWithdrawalValue: withdrawData.amount ?? playerExternalIdExisting.lastWithdrawalValue ?? 0,
      totalWithdrawalCount: (playerExternalIdExisting.totalWithdrawalCount ?? 0) + 1,
      totalWithdrawalValue: (playerExternalIdExisting.totalWithdrawalValue ?? 0) + (withdrawData.amount ?? 0)
    };

    await this.playersRepositories.updatePlayer(playerExternalIdExisting.id, updatePlayerData);

    const updateWithdrawData: CreateWithdrawDto = {
      transactionId: withdrawData.id,
      amount: withdrawData.amount,
      currency: withdrawData.currency,
      date: withdrawData.date,
      method: withdrawData.method,
      playerId: playerExternalIdExisting.id,
    };

    const createdWithdraw = await this.withdrawsRepositories.createWithdraw(updateWithdrawData);

    this.withdrawsListener.emitWithdrawCreated(createdWithdraw);

    return createdWithdraw;
  }
}
