import { forwardRef, Module } from '@nestjs/common';
import { LoginsController } from './infra/logins.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PlayersModule } from '../players/players.module';
import { LOGINS_SERVICE_TOKEN } from '../players/utils/loginsServiceToken';
import { LoginsRepository } from './infra/logins.repository';
import { PLAYERS_SERVICE_TOKEN } from './utils/playersServiceToken';
import { PlayersRepository } from '../players/infra/players.repository';
import { CreateLoginService } from './services/createLogin.service';
import { FindLoginsByPlayerIdService } from './services/findLoginsByPlayerId.service';
import { FindLoginByIdService } from './services/findLoginById.service';
import { SocketModule } from '../socket/socket.module';
import { LoginsListener } from '../socket/infra/listeners/logins.listener';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => PlayersModule),
    SocketModule,
  ],
  controllers: [
    LoginsController,
  ],
  providers: [
    CreateLoginService,
    FindLoginByIdService,
    FindLoginsByPlayerIdService,
    LoginsListener,
    {
      provide: LOGINS_SERVICE_TOKEN,
      useClass: LoginsRepository,
    },
    {
      provide: PLAYERS_SERVICE_TOKEN,
      useClass: PlayersRepository,
    },
  ],
})
export class LoginsModule { }
