import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  constructor(private readonly prisma: PrismaService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket) {
    console.log('handleConnection');

    this.server.emit('message', 'hello');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async pushMessage(socket) {
    const player = await this.prisma.player.findFirst();
    this.server.emit('message', player.username);
  }

  @SubscribeMessage('events')
  findAll(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Observable<WsResponse<number>> {
    console.log(data);
    client.emit('foo', 'bar');
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
