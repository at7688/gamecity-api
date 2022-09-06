import { Module } from '@nestjs/common';
import { GamePlatformService } from './game-platform.service';
import { GamePlatformController } from './game-platform.controller';

@Module({
  controllers: [GamePlatformController],
  providers: [GamePlatformService],
})
export class GamePlatformModule {}
