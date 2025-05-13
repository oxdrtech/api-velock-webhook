import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ANALYTICS_SERVICE_TOKEN } from './utils/analyticsServiceToken';
import { AnalyticsRepository } from './infra/analytics.repository';
import { LogsModule } from '../logs/logs.module';
import { AnalyzeContactsService } from './services/analyzeContacts.service';
import { PlayersModule } from '../players/players.module';
import { PLAYERS_SERVICE_TOKEN } from '../players/utils/playersServiceToken';
import { PlayersRepository } from '../players/infra/players.repository';
import { DEPOSITS_SERVICE_TOKEN } from '../deposits/utils/depositsServiceToken';
import { DepositsRepository } from '../deposits/infra/deposits.repository';
import { DepositsModule } from '../deposits/deposits.module';
import { PrismaModule } from '../prisma/prisma.module';
// import { AnalyzeTransactionsService } from './services/analyzeTransactions.service';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    HttpModule,
    PlayersModule,
    DepositsModule,
    LogsModule,
  ],
  providers: [
    AnalyzeContactsService,
    // AnalyzeTransactionsService,
    {
      provide: ANALYTICS_SERVICE_TOKEN,
      useClass: AnalyticsRepository,
    },
    {
      provide: PLAYERS_SERVICE_TOKEN,
      useClass: PlayersRepository,
    },
    {
      provide: DEPOSITS_SERVICE_TOKEN,
      useClass: DepositsRepository,
    },
  ],
})
export class AnalyticsModule { }
