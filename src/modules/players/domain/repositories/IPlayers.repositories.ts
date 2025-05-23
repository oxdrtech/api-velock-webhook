import { Player } from '@prisma/client';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';
import { FilterParams } from 'src/shared/types/filterParams';

export interface IPlayersRepositories {
  createPlayer(data: CreatePlayerDto): Promise<Player>;
  findPlayerById(id: string): Promise<Player>;
  findPlayerByExternalId(externalId: string): Promise<Player>;
  findPlayerByEmail(email: string): Promise<Player>;
  findPlayers(filters?: FilterParams): Promise<Player[]>;
  findPlayerAffiliateIds(): Promise<string[]>;
  updatePlayer(id: string, data: UpdatePlayerDto): Promise<Player>;
}
