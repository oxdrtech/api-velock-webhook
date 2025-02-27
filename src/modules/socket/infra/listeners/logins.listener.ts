import { Injectable } from '@nestjs/common';
import { SocketService } from '../../services/socket.service';
import { LOGINS_EVENTS } from '../../domain/events/logins.events';
import { Login } from '@prisma/client';

@Injectable()
export class LoginsListener {
  constructor(
    private readonly socketService: SocketService,
  ) { }

  emitLoginCreated(loginData: Login) {
    this.socketService.emit(LOGINS_EVENTS.CREATED, loginData);
  }
}
