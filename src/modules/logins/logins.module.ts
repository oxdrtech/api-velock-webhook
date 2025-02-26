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

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => PlayersModule),
  ],
  controllers: [
    LoginsController,
  ],
  providers: [
    CreateLoginService,
    FindLoginByIdService,
    FindLoginsByPlayerIdService,
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
