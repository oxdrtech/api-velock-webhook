import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Player } from '@prisma/client';
import { CreatePlayerDto } from '../domain/dto/create-player.dto';
import { IPlayersRepositories } from '../domain/repositories/IPlayers.repositories';
import { UpdatePlayerDto } from '../domain/dto/update-player.dto';
import { playersSelectedFields } from 'src/modules/prisma/utils/playersSelectedFields';

@Injectable()
export class PlayersRepository implements IPlayersRepositories {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  createPlayer(data: CreatePlayerDto): Promise<Player> {
    return this.prisma.player.create({ data });
  }

  findPlayerById(id: string): Promise<Player> {
    return this.prisma.player.findUnique({ where: { id }, select: playersSelectedFields });
  }

  findPlayerByExternalId(externalId: string): Promise<Player> {
    return this.prisma.player.findUnique({ where: { externalId }, select: playersSelectedFields });
  }

  findPlayerByEmail(email: string): Promise<Player> {
    return this.prisma.player.findUnique({ where: { email }, select: playersSelectedFields });
  }

  findPlayers(): Promise<Player[]> {
    return this.prisma.player.findMany();
  }

  updatePlayer(id: string, data: UpdatePlayerDto): Promise<Player> {
    return this.prisma.player.update({ where: { id }, data });
  }
}
