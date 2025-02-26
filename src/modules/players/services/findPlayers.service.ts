import { Inject, Injectable } from '@nestjs/common';
import { IPlayersRepositories } from '../domain/repositories/IPlayers.repositories';
import { Player } from '@prisma/client';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/logins/utils/playersServiceToken';

@Injectable()
export class FindPlayersService {
  constructor(
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
  ) { }

  async execute(): Promise<Player[]> {
    return await this.playersRepositories.findPlayers();
  }
}
