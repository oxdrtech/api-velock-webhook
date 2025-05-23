import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IDepositsRepositories } from '../domain/repositories/IDeposits.repositories';
import { Deposit } from '@prisma/client';
import { CreateDepositDto } from '../domain/dto/create-deposit.dto';
import { UpdateDepositDto } from '../domain/dto/update-deposit.dto';
import { depositsSelectedFields } from 'src/modules/prisma/utils/depositsSelectedFields';
import { FilterParams } from 'src/shared/types/filterParams';

@Injectable()
export class DepositsRepository implements IDepositsRepositories {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  createDeposit(data: CreateDepositDto): Promise<Deposit> {
    return this.prisma.deposit.create({ data });
  }

  findDepositById(id: string): Promise<Deposit> {
    return this.prisma.deposit.findUnique({ where: { id }, select: depositsSelectedFields });
  }

  findDepositByTransactionId(transactionId: string): Promise<Deposit> {
    return this.prisma.deposit.findUnique({ where: { transactionId }, select: depositsSelectedFields });
  }

  findDepositsByPlayerId(playerId: string): Promise<Deposit[]> {
    return this.prisma.deposit.findMany({ where: { playerId }, select: depositsSelectedFields });
  }

  findDeposits(filters?: FilterParams): Promise<Deposit[]> {
    return this.prisma.deposit.findMany({
      where: {
        AND: [
          { depositStatus: 'APPROVED' },
          filters?.affiliateIds?.length ? {
            player: {
              affiliateId: {
                in: filters.affiliateIds
              }
            }
          } : {},
          filters?.startDate && filters?.endDate ? {
            date: {
              gte: filters.startDate,
              lte: filters.endDate
            }
          } : {},
        ]
      },
    });
  }

  paydDeposit(id: string, data: UpdateDepositDto): Promise<Deposit> {
    return this.prisma.deposit.update({ where: { id }, data });
  }
}
