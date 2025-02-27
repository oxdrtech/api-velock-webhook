import { Injectable } from '@nestjs/common';
import { SocketService } from '../../services/socket.service';
import { WITHDRAWS_EVENTS } from '../../domain/events/withdraws.events';
import { Withdraw } from '@prisma/client';

@Injectable()
export class WithdrawsListener {
  constructor(
    private readonly socketService: SocketService,
  ) { }

  emitWithdrawCreated(withdrawData: Withdraw) {
    this.socketService.emit(WITHDRAWS_EVENTS.CREATED, withdrawData);
  }
}
