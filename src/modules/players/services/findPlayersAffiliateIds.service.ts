import { Inject, Injectable } from '@nestjs/common';
import { IPlayersRepositories } from '../domain/repositories/IPlayers.repositories';
import { PLAYERS_SERVICE_TOKEN } from '../utils/playersServiceToken';

@Injectable()
export class FindPlayerAffiliateIdsService {
  constructor(
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
  ) { }

  async execute(): Promise<string[]> {
    return await this.playersRepositories.findPlayerAffiliateIds();
  }
}
