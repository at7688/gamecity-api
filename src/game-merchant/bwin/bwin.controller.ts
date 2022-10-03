import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { BwinService } from './bwin.service';

@Controller('game/bwin')
@Platforms([PlatformType.PLAYER])
export class BwinController {
  constructor(private readonly bwinService: BwinService) {}

  // @Post('create')
  // createPlayer(@User() player: Player) {
  //   return this.bwinService.createPlayer(player);
  // }

  @Get('games')
  getGameList() {
    return this.bwinService.getGameList();
  }

  @Get('login')
  login(@Query('game_id') game_id: string, @User() player: Player) {
    return this.bwinService.login(game_id, player);
  }

  @Post('logout')
  logout(@User() player: Player) {
    return this.bwinService.logout(player);
  }

  @Get('balance')
  getPlayer(@User() player: Player) {
    return this.bwinService.getBalance(player);
  }

  @Get('back')
  transferBack(@User() player: Player) {
    return this.bwinService.transferBack(player);
  }

  @Post('records')
  fetchBetRecords(@Body('start') start, @Body('end') end) {
    return this.bwinService.fetchBetRecords(new Date(start), new Date(end));
  }
  @Get('record/:id')
  fetchBetRecord(@Param('id') id) {
    return this.bwinService.fetchBetRecord(id);
  }
}
