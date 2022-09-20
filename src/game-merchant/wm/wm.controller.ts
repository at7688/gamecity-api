import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { WmService } from './wm.service';

@Controller('game/wm')
@Platforms([PlatformType.PLAYER])
export class WmController {
  constructor(private readonly wmService: WmService) {}

  // @Post('create')
  // createPlayer(@User() player: Player) {
  //   return this.wmService.createPlayer(player);
  // }

  @Get('games')
  getGameList() {
    return this.wmService.getGameList();
  }

  @Get('login')
  login(@Query('game_id') game_id: string, @User() player: Player) {
    return this.wmService.login(game_id, player);
  }

  @Get('balance')
  getPlayer(@User() player: Player) {
    return this.wmService.getBalance(player);
  }

  @Get('back')
  transferBack(@User() player: Player) {
    return this.wmService.transferBack(player);
  }

  @Post('records')
  fetchBetRecords(@Body('start') start, @Body('end') end) {
    return this.wmService.fetchBetRecords(new Date(start), new Date(end));
  }
}
