import { Injectable } from '@nestjs/common';
import { SocketGateway } from '../infra/gateway/socket.gateway';
import { Deposit, Login, Player, Withdraw } from '@prisma/client';

@Injectable()
export class SocketService {
  constructor(
    private readonly socketGateway: SocketGateway,
  ) { }

  emit(event: string, data: Player | Deposit | Withdraw | Login) {
    this.socketGateway.server.emit(event, data);
  }
}
