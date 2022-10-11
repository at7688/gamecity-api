import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UpdateGamePlatformDto } from './dto/update-game-platform.dto';
import { GamePlatformService } from './game-platform.service';

@Controller('gamePlatform')
export class GamePlatformController {
  constructor(private readonly gamePlatformService: GamePlatformService) {}

  @Get('list')
  findAll() {
    return this.gamePlatformService.findAll();
  }

  @Post(':code')
  update(@Param('code') code: string, @Body() data: UpdateGamePlatformDto) {
    return this.gamePlatformService.update(code, data);
  }
}
