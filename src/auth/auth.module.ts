import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AgentController } from './agent.controller';

@Module({
  imports: [UserModule],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
  controllers: [AuthController, AgentController],
})
export class AuthModule {}
