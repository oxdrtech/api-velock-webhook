import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { SocketService } from 'src/modules/websocket/socket.service';

@Injectable()
export class PlayersPublisher {
  constructor(
    private readonly socketService: SocketService,
  ) { }

  publishPlayerCreatedEvent(playerData: Player) {
    this.socketService.emitEvent('player_created', playerData);
  }
}
