import { PrismaService } from "src/modules/prisma/prisma.service";
import { ILogsRepositories } from "../domain/repositories/ILogs.repositories";
import { CreateLogDto } from "../domain/dto/create-log.dto";
import { Log } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LogsRepository implements ILogsRepositories {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  createLog(data: CreateLogDto): Promise<Log> {
    return this.prisma.log.create({ data });
  }
}
