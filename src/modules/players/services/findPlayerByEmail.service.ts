import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Player } from '@prisma/client';
import { IPlayersRepositories } from '../domain/repositories/IPlayers.repositories';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/logins/utils/playersServiceToken';

@Injectable()
export class FindPlayerByEmailService {
  constructor(
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playerRepositories: IPlayersRepositories,
  ) { }

  async execute(email: string): Promise<Player> {
    const player = await this.playerRepositories.findPlayerByEmail(email);

    if (!player) throw new NotFoundException('Player não encontrado');
    
    return player;
  }
}
