import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPlayersRepositories } from '../domain/repositories/IPlayers.repositories';
import { UpdatePlayerDto } from '../domain/dto/update-player.dto';
import { Player } from '@prisma/client';
import { PLAYERS_SERVICE_TOKEN } from '../utils/playersServiceToken';

@Injectable()
export class UpdatePlayerService {
  constructor(
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
  ) { }

  async execute(id: string, data: UpdatePlayerDto): Promise<Player> {
    const player = await this.playersRepositories.findPlayerById(id);

    if (!player) throw new NotFoundException('Player não encontrado');

    return await this.playersRepositories.updatePlayer(id, data);
  }
}