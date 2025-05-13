import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PlayersModule } from './modules/players/players.module';
import { DepositsModule } from './modules/deposits/deposits.module';
import { WithdrawsModule } from './modules/withdraws/withdraws.module';
import { LoginsModule } from './modules/logins/logins.module';
import { SocketModule } from './modules/socket/socket.module';
import { LogsModule } from './modules/logs/logs.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    PrismaModule,
    PlayersModule,
    DepositsModule,
    WithdrawsModule,
    LoginsModule,
    SocketModule,
    LogsModule,
    AnalyticsModule,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule { }
