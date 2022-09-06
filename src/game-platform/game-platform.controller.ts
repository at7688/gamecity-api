import { UpdateGamePlatformDto } from './dto/update-game-platform.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SearchGamePlatformsDto } from './dto/search-game-platforms.dto';
import { GamePlatformService } from './game-platform.service';

@Controller('game-platforms')
export class GamePlatformController {
  constructor(private readonly gamePlatformService: GamePlatformService) {}

  @Get()
  findAll(@Query() query: SearchGamePlatformsDto) {
    return this.gamePlatformService.findAll(query);
  }

  @Post(':code')
  update(@Param('code') code: string, @Body() data: UpdateGamePlatformDto) {
    return this.gamePlatformService.update(code, data);
  }
}
