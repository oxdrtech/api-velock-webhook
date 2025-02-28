import { Module } from '@nestjs/common';
import { PlayersController } from './infra/players.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PlayersRepository } from './infra/players.repository';
import { CreatePlayerService } from './services/createPlayer.service';
import { FindPlayerByEmailService } from './services/findPlayerByEmail.service';
import { DepositsModule } from '../deposits/deposits.module';
import { UpdatePlayerService } from './services/updatePlayer.service';
import { FindPlayersService } from './services/findPlayers.service';
import { WithdrawsModule } from '../withdraws/withdraws.module';
import { LoginsModule } from '../logins/logins.module';
import { FindPlayerByExternalIdService } from './services/findPlayerByExternalId.service';
import { FindPlayerByIdService } from './services/findPlayerById.service';
import { SocketModule } from '../socket/socket.module';
import { PlayersListener } from '../socket/infra/listeners/players.listener';
import { PLAYERS_SERVICE_TOKEN } from './utils/playersServiceToken';

@Module({
  imports: [
    PrismaModule,
    DepositsModule,
    WithdrawsModule,
    LoginsModule,
    SocketModule,
  ],
  controllers: [
    PlayersController,
  ],
  providers: [
    CreatePlayerService,
    FindPlayerByIdService,
    FindPlayerByExternalIdService,
    FindPlayerByEmailService,
    FindPlayersService,
    UpdatePlayerService,
    PlayersListener,
    {
      provide: PLAYERS_SERVICE_TOKEN,
      useClass: PlayersRepository,
    },
  ],
  exports: [
    FindPlayerByIdService,
    FindPlayerByExternalIdService,
    UpdatePlayerService,
  ]
})
export class PlayersModule { }
