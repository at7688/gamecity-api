import { Controller, Get, Post, Req } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Post('bet')
  @Public()
  bet() {
    return 'OK';
  }

  @Get()
  fetchAll() {
    return this.gameService.fetchAll();
  }
}
