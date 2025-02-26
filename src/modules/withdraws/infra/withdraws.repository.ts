import { Injectable } from "@nestjs/common";
import { IWithdrawsRepositories } from "../domain/repositories/IWithdraw.repositories";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { Withdraw } from "@prisma/client";
import { CreateWithdrawDto } from "../domain/dto/create-withdraw.dto";
import { withdrawsSelectedFields } from "src/modules/prisma/utils/withdrawsSelectedFields";

@Injectable()
export class WithdrawRepository implements IWithdrawsRepositories {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  createWithdraw(data: CreateWithdrawDto): Promise<Withdraw> {
    return this.prisma.withdraw.create({ data });
  }

  findWithdrawById(id: string): Promise<Withdraw> {
    return this.prisma.withdraw.findUnique({ where: { id }, select: withdrawsSelectedFields });
  }

  findWithdrawByTransactionId(transactionId: string): Promise<Withdraw> {
    return this.prisma.withdraw.findUnique({ where: { transactionId }, select: withdrawsSelectedFields });
  }

  findWithdrawsByPlayerId(playerId: string): Promise<Withdraw[]> {
    return this.prisma.withdraw.findMany({ where: { playerId }, select: withdrawsSelectedFields });
  }
}
