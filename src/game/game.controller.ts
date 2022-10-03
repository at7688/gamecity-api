import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { PlatformType } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';
import { Public } from 'src/metas/public.meta';
import { CreateGameDto } from './dto/create-game.dto';
import { CreateGamesDto } from './dto/create-games.dto';
import { SearchGameDto } from './dto/search-game.dto';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('create')
  create(@Body() body: CreateGameDto) {
    return this.gameService.create(body);
  }

  @Post('batch')
  // @Platforms([PlatformType.PLAYER])
  batchCreate(@Body() body: CreateGamesDto) {
    return this.gameService.createMany(body);
  }

  @Post('list')
  fetchAll(@Body() saerch: SearchGameDto) {
    return this.gameService.fetchAll(saerch);
  }
}
