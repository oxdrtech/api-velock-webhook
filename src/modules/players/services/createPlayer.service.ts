import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { IPlayersRepositories } from '../domain/repositories/IPlayers.repositories';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/logins/utils/playersServiceToken';
import { CreatePlayerEventDto } from '../domain/dto/create-player-event.dto';
import { CreatePlayerDto } from '../domain/dto/create-player.dto';
import { PlayersListener } from 'src/modules/socket/infra/listeners/players.listener';

@Injectable()
export class CreatePlayerService {
  constructor(
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playerRepositories: IPlayersRepositories,
    private readonly playerListener: PlayersListener,
  ) { }

  async execute(data: CreatePlayerEventDto): Promise<Player> {
    const { data: playerData } = data;
    const [playerExternalIdExists, playerEmailExists] = await Promise.all([
      this.playerRepositories.findPlayerByExternalId(playerData.userId),
      this.playerRepositories.findPlayerByEmail(playerData.email),
    ]);

    if (playerExternalIdExists) throw new BadRequestException('Já existe um player com esse userId');
    if (playerEmailExists) throw new BadRequestException('Já existe um player com esse email');

    const updatePlayerData: CreatePlayerDto = {
      externalId: playerData.userId,
      tenantId: playerData.tenantId,
      affiliateId: playerData.affiliateId,
      name: playerData.name,
      email: playerData.email,
      country: playerData.country,
      language: playerData.language,
      date: playerData.date,
      phoneCountryCode: playerData.phoneCountryCode,
      phone: playerData.phone,
      balance: playerData.balance,
      birthDate: playerData.birthDate,
    }

    const createdPlayer = await this.playerRepositories.createPlayer(updatePlayerData);

    this.playerListener.emitPlayerCreated(createdPlayer);

    return createdPlayer;
  }
}
