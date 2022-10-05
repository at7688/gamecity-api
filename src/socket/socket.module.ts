import { Module } from '@nestjs/common';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [DashboardModule],
  providers: [SocketGateway],
})
export class SocketModule {}
