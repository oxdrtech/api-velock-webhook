import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WITHDRAW_SERVICE_TOKEN } from '../utils/withdrawsServiceToken';
import { IWithdrawsRepositories } from '../domain/repositories/IWithdraw.repositories';
import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';
import { CreateWithdrawDto } from '../domain/dto/create-withdraw.dto';
import { Withdraw } from '@prisma/client';
import { UpdatePlayerDto } from 'src/modules/players/domain/dto/update-player.dto';
import { CreateWithdrawEventDto } from '../domain/dto/create-withdraw-event.dto';
import { WithdrawsListener } from 'src/modules/socket/infra/listeners/withsraws.listener';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/players/utils/playersServiceToken';

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

    if (withdrawIdExisting) throw new BadRequestException('Esse saque já foi registrado');

    let player = playerExternalIdExisting;
    if (!player) {
      player = await this.playersRepositories.createPlayer({
        externalId: withdrawData.userId,
        tenantId: withdrawData.tenantId,
        name: withdrawData.name,
        email: withdrawData.email || "",
        phone: withdrawData.phone,
      })
    };

    const withdrawAmountInCents = Math.round(withdrawData.amount * 100);

    const updatePlayerData: UpdatePlayerDto = {
      balance: (player.balance ?? 0) - withdrawAmountInCents,
      lastWithdrawalDate: new Date(),
      lastWithdrawalValue: withdrawAmountInCents ?? player.lastWithdrawalValue ?? 0,
      totalWithdrawalCount: (player.totalWithdrawalCount ?? 0) + 1,
      totalWithdrawalValue: (player.totalWithdrawalValue ?? 0) + withdrawAmountInCents,
    };

    await this.playersRepositories.updatePlayer(player.id, updatePlayerData);

    const updateWithdrawData: CreateWithdrawDto = {
      transactionId: withdrawData.id,
      amount: withdrawAmountInCents,
      method: withdrawData.method,
      date: withdrawData.date,
      currency: withdrawData.currency,
      playerId: player.id,
    };

    const createdWithdraw = await this.withdrawsRepositories.createWithdraw(updateWithdrawData);

    const updatedPlayer = await this.playersRepositories.findPlayerByExternalId(withdrawData.userId);
    this.withdrawsListener.emitWithdrawCreated(createdWithdraw, updatedPlayer);

    return createdWithdraw;
  }
}
