import { forwardRef, Module } from '@nestjs/common';
import { WithdrawsController } from './infra/withdraws.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PlayersModule } from '../players/players.module';
import { WITHDRAW_SERVICE_TOKEN } from './utils/withdrawsServiceToken';
import { WithdrawRepository } from './infra/withdraws.repository';
import { CreateWithdrawService } from './services/createWithdraw.service';
import { PlayersRepository } from '../players/infra/players.repository';
import { PLAYERS_SERVICE_TOKEN } from '../logins/utils/playersServiceToken';
import { FindWithdrawByIdService } from './services/findWithdrawById.service';
import { FindWithdrawByTransactionIdService } from './services/findWithdrawByTransactionId.service';
import { FindWithdrawsByPlayerIdService } from './services/findWithdrawsByPlayerId.service';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => PlayersModule),
  ],
  controllers: [
    WithdrawsController,
  ],
  providers: [
    CreateWithdrawService,
    FindWithdrawByIdService,
    FindWithdrawByTransactionIdService,
    FindWithdrawsByPlayerIdService,
    {
      provide: WITHDRAW_SERVICE_TOKEN,
      useClass: WithdrawRepository,
    },
    {
      provide: PLAYERS_SERVICE_TOKEN,
      useClass: PlayersRepository,
    },
  ],
})
export class WithdrawsModule { }
