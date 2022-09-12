import { Module } from '@nestjs/common';
import { GameRatioService } from './game-ratio.service';
import { GameRatioController } from './game-ratio.controller';

@Module({
  controllers: [GameRatioController],
  providers: [GameRatioService]
})
export class GameRatioModule {}
