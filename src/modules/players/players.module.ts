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
import { LogsModule } from '../logs/logs.module';
import { FindPlayerAffiliateIdsService } from './services/findPlayersAffiliateIds.service';

@Module({
  imports: [
    PrismaModule,
    DepositsModule,
    WithdrawsModule,
    LoginsModule,
    SocketModule,
    LogsModule,
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
    FindPlayerAffiliateIdsService,
    UpdatePlayerService,
    PlayersListener,
    {
      provide: PLAYERS_SERVICE_TOKEN,
      useClass: PlayersRepository,
    },
  ],
})
export class PlayersModule { }
