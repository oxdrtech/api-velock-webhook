import { Module } from '@nestjs/common';
import { SocketGateway } from './infra/gateway/socket.gateway';
import { SocketService } from './services/socket.service';
import { PlayersListener } from './infra/listeners/players.listener';
import { DepositsListener } from './infra/listeners/deposits.listener';
import { WithdrawsListener } from './infra/listeners/withsraws.listener';
import { LoginsListener } from './infra/listeners/logins.listener';

@Module({
  providers: [
    SocketGateway,
    SocketService,
    PlayersListener,
    DepositsListener,
    WithdrawsListener,
    LoginsListener,
  ],
  exports: [
    SocketService,
  ],
})
export class SocketModule { }
