import { forwardRef, Module } from '@nestjs/common';
import { DepositsController } from './infra/deposits.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DEPOSITS_SERVICE_TOKEN } from './utils/depositsServiceToken';
import { CreateDepositService } from './services/createDeposit.service';
import { DepositsRepository } from './infra/deposits.repository';
import { PlayersModule } from '../players/players.module';
import { PlayersRepository } from '../players/infra/players.repository';
import { FindDepositByIdService } from './services/findDepositById.service';
import { FindDepositsByPlayerIdService } from './services/findDepositsByPlayerId.service';
import { PaydDepositService } from './services/paydDeposit.service';
import { FindDepositByTransactionIdService } from './services/findDepositByTransactionId.service';
import { SocketModule } from '../socket/socket.module';
import { DepositsListener } from '../socket/infra/listeners/deposits.listener';
import { PLAYERS_SERVICE_TOKEN } from '../players/utils/playersServiceToken';
import { LogsModule } from '../logs/logs.module';
import { FindDepositsService } from './services/findDeposits.service';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => PlayersModule),
    SocketModule,
    LogsModule,
  ],
  controllers: [
    DepositsController,
  ],
  providers: [
    CreateDepositService,
    FindDepositByIdService,
    FindDepositByTransactionIdService,
    FindDepositsByPlayerIdService,
    FindDepositsService,
    PaydDepositService,
    DepositsListener,
    {
      provide: DEPOSITS_SERVICE_TOKEN,
      useClass: DepositsRepository,
    },
    {
      provide: PLAYERS_SERVICE_TOKEN,
      useClass: PlayersRepository,
    },
  ],
})
export class DepositsModule { }
