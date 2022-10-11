import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { CreateGamesDto } from './dto/create-games.dto';
import { SearchGameDto } from './dto/search-game.dto';
import { GameService } from './game.service';

@Controller('game')
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

  @Get('options')
  options(@Query() saerch: SearchGameDto) {
    return this.gameService.fetchAll(saerch);
  }
}
