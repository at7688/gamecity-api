import { OnEvent } from '@nestjs/event-emitter';
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
import {
  DepositPayload,
  PlayerCardPayload,
  PromotionApplyPayload,
  RegisterPayload,
  WithdrawPayload,
} from './types';

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

  @OnEvent('register')
  playerRegister(payload: RegisterPayload) {
    this.server.emit('register', payload);
  }

  @OnEvent('deposit')
  deposit(payload: DepositPayload) {
    this.server.emit('deposit', payload);
  }

  @OnEvent('withdraw')
  withdraw(payload: WithdrawPayload) {
    this.server.emit('withdraw', payload);
  }

  @OnEvent('bankcard')
  playerCard(payload: PlayerCardPayload) {
    this.server.emit('bankcard', payload);
  }

  @OnEvent('applyPromo')
  promotionApply(payload: PromotionApplyPayload) {
    this.server.emit('applyPromo', payload);
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async pushMessage(socket) {
  //   const player = await this.prisma.player.findFirst();
  //   this.server.emit('message', player.username);
  // }

  @SubscribeMessage('events')
  findAll(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Observable<WsResponse<number>> {
    console.log(data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }
}
