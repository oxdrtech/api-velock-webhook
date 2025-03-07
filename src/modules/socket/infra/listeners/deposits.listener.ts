import { Injectable } from '@nestjs/common';
import { SocketService } from '../../services/socket.service';
import { DEPOSITS_EVENTS } from '../../domain/events/deposits.events';
import { Deposit, Player } from '@prisma/client';

@Injectable()
export class DepositsListener {
  constructor(
    private readonly socketService: SocketService,
  ) { }

  emitDepositCreated(depositData: Deposit, updatedPlayer: Player) {
    this.socketService.emit(DEPOSITS_EVENTS.CREATED, depositData, updatedPlayer);
  }

  emitDepositPayd(depositData: Deposit, updatedPlayer: Player) {
    this.socketService.emit(DEPOSITS_EVENTS.PAYD, depositData, updatedPlayer);
  }
}
