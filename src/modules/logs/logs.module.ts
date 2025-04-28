import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateLogService } from './services/createLog.service';
import { LOG_SERVICE_TOKEN } from './utils/logsServiceToken';
import { LogsRepository } from './infra/logs.repository';
@Module({
  imports: [
    PrismaModule,
  ],
  providers: [
    CreateLogService,
    {
      provide: LOG_SERVICE_TOKEN,
      useClass: LogsRepository,
    },
  ],
  exports: [
    CreateLogService,
  ]
})
export class LogsModule { }
