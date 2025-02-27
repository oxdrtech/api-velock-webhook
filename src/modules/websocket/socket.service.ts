import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketService implements OnModuleInit, OnModuleDestroy {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8081/'); // URL da API 2
  }

  onModuleInit() {
    this.socket.connect();
  }

  onModuleDestroy() {
    this.socket.disconnect();
  }

  emitEvent(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
