import { Module } from '@nestjs/common';
import { PlayersController } from './infra/players.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PlayersRepository } from './infra/players.repository';
import { CreatePlayerService } from './services/createPlayer.service';
import { FindPlayerByEmailService } from './services/findPlayerByEmail.service';
import { DepositsModule } from '../deposits/deposits.module';
import { UpdatePlayerService } from './services/updatePlayer.service';
import { FindPlayersService } from './services/findPlayers.service';
import { PLAYERS_SERVICE_TOKEN } from '../logins/utils/playersServiceToken';
import { WithdrawsModule } from '../withdraws/withdraws.module';
import { LoginsModule } from '../logins/logins.module';
import { FindPlayerByExternalIdService } from './services/findPlayerByExternalId.service';
import { FindPlayerByIdService } from './services/findPlayerById.service';
import { WebSocketModule } from '../websocket/websocket.module';
import { PlayersPublisher } from './infra/players.publisher';

@Module({
  imports: [
    PrismaModule,
    DepositsModule,
    WithdrawsModule,
    LoginsModule,
    WebSocketModule,
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
    PlayersPublisher,
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
