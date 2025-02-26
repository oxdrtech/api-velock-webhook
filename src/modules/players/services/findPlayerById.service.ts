import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/logins/utils/playersServiceToken';
import { IPlayersRepositories } from '../domain/repositories/IPlayers.repositories';
import { Player } from '@prisma/client';

@Injectable()
export class FindPlayerByIdService {
  constructor(
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
  ) { }

  async execute(id: string): Promise<Player> {
    const player = await this.playersRepositories.findPlayerById(id);

    if (!player) throw new NotFoundException('Player não encontrado');
    
    return player;
  }
}
