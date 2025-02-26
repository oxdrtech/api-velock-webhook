import { Injectable } from "@nestjs/common";
import { ILoginsRepositories } from "../domain/repositories/ILogins.repositories";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { Login } from "@prisma/client";
import { CreateLoginDto } from "../domain/dto/create-login.dto";
import { loginsSelectedFields } from "src/modules/prisma/utils/loginsSelectedFields";

@Injectable()
export class LoginsRepository implements ILoginsRepositories {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  createLogin(data: CreateLoginDto): Promise<Login> {
    return this.prisma.login.create({ data });
  }

  findLoginById(id: string): Promise<Login> {
    return this.prisma.login.findUnique({ where: { id }, select: loginsSelectedFields });
  }

  findLoginsByPlayerId(playerId: string): Promise<Login[]> {
    return this.prisma.login.findMany({ where: { playerId }, select: loginsSelectedFields });
  }
}
