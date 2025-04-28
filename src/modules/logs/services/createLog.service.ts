import { Inject, Injectable } from "@nestjs/common";
import { LOGS_SERVICE_TOKEN } from "../utils/logsServiceToken";
import { ILogsRepositories } from "../domain/repositories/ILogs.repositories";
import { CreateLogDto } from "../domain/dto/create-log.dto";
import { Log, LogStatus, LogType } from "@prisma/client";

@Injectable()
export class CreateLogService {
  constructor(
    @Inject(LOGS_SERVICE_TOKEN)
    private readonly logsRepositories: ILogsRepositories,
  ) { }

  async execute(data: CreateLogDto): Promise<Log> {
    try {
      return this.logsRepositories.createLog(data);
    } catch (error) {
      const stackTrace = error.stack?.split("\n").slice(0, 10).join("\n");
      return this.logsRepositories.createLog({
        logStatus: LogStatus.FAILED,
        logType: LogType.SYSTEM,
        message: `Erro ao criar log: ${error.message}`,
        payload: { stack: stackTrace },
      });
    }
  }
}
