import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PlayersModule } from './modules/players/players.module';
import { DepositsModule } from './modules/deposits/deposits.module';
import { WithdrawsModule } from './modules/withdraws/withdraws.module';
import { LoginsModule } from './modules/logins/logins.module';

@Module({
  imports: [
    PrismaModule,
    PlayersModule,
    DepositsModule,
    WithdrawsModule,
    LoginsModule,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule { }
