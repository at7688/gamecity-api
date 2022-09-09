import { Module } from '@nestjs/common';
import { GameAccountService } from './game-account.service';
import { GameAccountController } from './game-account.controller';

@Module({
  controllers: [GameAccountController],
  providers: [GameAccountService]
})
export class GameAccountModule {}
