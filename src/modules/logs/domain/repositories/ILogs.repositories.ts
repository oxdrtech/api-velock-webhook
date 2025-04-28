import { Log } from "@prisma/client";
import { CreateLogDto } from "../dto/create-log.dto";

export interface ILogsRepositories {
  createLog(data: CreateLogDto): Promise<Log>;
}
