import { Injectable } from '@nestjs/common';
import { SocketService } from '../../services/socket.service';
import { PLAYERS_EVENTS } from '../../domain/events/players.events';
import { Player } from '@prisma/client';

@Injectable()
export class PlayersListener {
  constructor(
    private readonly socketService: SocketService,
  ) { }

  emitPlayerCreated(playerData: Player) {
    this.socketService.emit(PLAYERS_EVENTS.CREATED, playerData);
  }
}
