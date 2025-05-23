import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Player } from '@prisma/client';
import { CreatePlayerDto } from '../domain/dto/create-player.dto';
import { IPlayersRepositories } from '../domain/repositories/IPlayers.repositories';
import { UpdatePlayerDto } from '../domain/dto/update-player.dto';
import { playersSelectedFields } from 'src/modules/prisma/utils/playersSelectedFields';
import { FilterParams } from 'src/shared/types/filterParams';

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
    return this.prisma.player.findUnique({ where: { externalId } });
  }

  findPlayerByEmail(email: string): Promise<Player> {
    return this.prisma.player.findUnique({ where: { email }, select: playersSelectedFields });
  }

  findPlayers(filters?: FilterParams): Promise<Player[]> {
    return this.prisma.player.findMany({
      where: {
        AND: [
          filters?.affiliateIds ? {
            affiliateId: {
              in: filters.affiliateIds
            }
          } : {},
          filters?.startDate && filters?.endDate ? {
            createdAt: {
              gte: filters.startDate,
              lte: filters.endDate
            }
          } : {},
        ]
      },
    });
  }

  async findPlayerAffiliateIds(): Promise<string[]> {
    const result = await this.prisma.player.groupBy({
      by: ['affiliateId'],
      where: { affiliateId: { not: null } },
      orderBy: { affiliateId: 'asc' }
    });
    return result.map(r => r.affiliateId!).filter(Boolean);
  }

  updatePlayer(id: string, data: UpdatePlayerDto): Promise<Player> {
    return this.prisma.player.update({ where: { id }, data });
  }
}
