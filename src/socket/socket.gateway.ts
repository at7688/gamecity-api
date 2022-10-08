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
import { DashboardService } from 'src/dashboard/dashboard.service';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardService: DashboardService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket) {
    console.log('handleConnection');

    this.server.emit('message', 'hello');
  }

  @OnEvent('player.register')
  playerRegister(payload: RegisterPayload) {
    this.server.emit('register', payload);
  }

  @OnEvent('deposit.apply.bank')
  bankDeposit(payload: DepositPayload) {
    this.server.emit('deposit', payload);
  }

  @OnEvent('withdraw.apply')
  withdraw(payload: WithdrawPayload) {
    this.server.emit('withdraw', payload);
  }

  @OnEvent('playerCard.apply')
  playerCard(payload: PlayerCardPayload) {
    this.server.emit('bankcard', payload);
  }

  @OnEvent('promotion.apply')
  promotionApply(payload: PromotionApplyPayload) {
    this.server.emit('applyPromo', payload);
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async pushDashboard(socket) {
  //   const result = await this.dashboardService.getRangeCounts();
  //   this.server.emit('dashboard', result);
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
