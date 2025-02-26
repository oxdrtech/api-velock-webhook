import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Withdraw } from '@prisma/client';
import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';
import { WITHDRAW_SERVICE_TOKEN } from '../utils/withdrawsServiceToken';
import { IWithdrawsRepositories } from '../domain/repositories/IWithdraw.repositories';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/logins/utils/playersServiceToken';

@Injectable()
export class FindWithdrawsByPlayerIdService {
  constructor(
    @Inject(WITHDRAW_SERVICE_TOKEN)
    private readonly withdrawsRepositories: IWithdrawsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
  ) { }

  async execute(playerId: string): Promise<Withdraw[]> {
    const [playerUserIdExists, withdrawsByPlayerUserIdExists] = await Promise.all([
      this.playersRepositories.findPlayerById(playerId),
      this.withdrawsRepositories.findWithdrawsByPlayerId(playerId),
    ]);

    if (!playerUserIdExists) throw new NotFoundException('Player não existe');
    if (withdrawsByPlayerUserIdExists.length === 0) throw new NotFoundException('Esse player ainda não possui nenhum saque.');

    return withdrawsByPlayerUserIdExists;
  }
}
