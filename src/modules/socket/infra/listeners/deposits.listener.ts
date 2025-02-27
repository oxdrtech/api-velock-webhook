import { Injectable } from '@nestjs/common';
import { SocketService } from '../../services/socket.service';
import { DEPOSITS_EVENTS } from '../../domain/events/deposits.events';
import { Deposit } from '@prisma/client';

@Injectable()
export class DepositsListener {
  constructor(
    private readonly socketService: SocketService,
  ) { }

  emitDepositCreated(depositData: Deposit) {
    this.socketService.emit(DEPOSITS_EVENTS.CREATED, depositData);
  }

  emitDepositPayd(depositData: Deposit) {
    this.socketService.emit(DEPOSITS_EVENTS.PAYD, depositData);
  }
}
