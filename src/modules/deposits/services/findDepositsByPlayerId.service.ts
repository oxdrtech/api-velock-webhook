import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DEPOSITS_SERVICE_TOKEN } from '../utils/depositsServiceToken';
import { IDepositsRepositories } from '../domain/repositories/IDeposits.repositories';
import { Deposit } from '@prisma/client';
import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/logins/utils/playersServiceToken';

@Injectable()
export class FindDepositsByPlayerIdService {
  constructor(
    @Inject(DEPOSITS_SERVICE_TOKEN)
    private readonly depositsRepositories: IDepositsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
  ) { }

  async execute(playerId: string): Promise<Deposit[]> {
    const [playerIdExists, depositsByPlayerIdExists] = await Promise.all([
      this.playersRepositories.findPlayerById(playerId),
      this.depositsRepositories.findDepositsByPlayerId(playerId),
    ]);

    if (!playerIdExists) throw new NotFoundException('Player não existe');
    if (depositsByPlayerIdExists.length === 0) throw new NotFoundException('Esse player ainda não possui nenhum deposito.');

    return depositsByPlayerIdExists;
  }
}
