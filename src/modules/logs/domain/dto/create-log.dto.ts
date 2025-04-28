import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LogStatus, LogType } from '@prisma/client';

export class CreateLogDto {
  @IsEnum(LogStatus)
  logStatus: LogStatus;

  @IsEnum(LogType)
  logType: LogType;

  @IsString()
  message: string;

  @IsOptional()
  payload?: object; // Pode ser JSON ou objeto qualquer

  @IsOptional()
  @IsString()
  entityId?: string;
}
