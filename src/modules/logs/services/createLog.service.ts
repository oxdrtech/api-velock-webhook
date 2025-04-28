import { Inject, Injectable } from "@nestjs/common";
import { LOG_SERVICE_TOKEN } from "../utils/logsServiceToken";
import { ILogsRepositories } from "../domain/repositories/ILogs.repositories";
import { CreateLogDto } from "../domain/dto/create-log.dto";
import { Log } from "@prisma/client";

@Injectable()
export class CreateLogService {
  constructor(
    @Inject(LOG_SERVICE_TOKEN)
    private readonly logsRepositories: ILogsRepositories,
  ) { }

  async execute(data: CreateLogDto): Promise<Log> {
    return this.logsRepositories.createLog(data)
  }
}