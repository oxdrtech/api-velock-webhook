import { Inject, Injectable } from '@nestjs/common';
import { IPlayersRepositories } from '../domain/repositories/IPlayers.repositories';
import { Player } from '@prisma/client';
import { PLAYERS_SERVICE_TOKEN } from '../utils/playersServiceToken';
import { FilterParams } from 'src/shared/types/filterParams';

@Injectable()
export class FindPlayersService {
  constructor(
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
  ) { }

  async execute(filters?: FilterParams): Promise<Player[]> {
    return await this.playersRepositories.findPlayers(filters);
  }
}
