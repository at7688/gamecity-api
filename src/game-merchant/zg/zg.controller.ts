import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { ZgService } from './zg.service';

@Controller('game/zg')
@Platforms([PlatformType.PLAYER])
export class ZgController {
  constructor(private readonly zgService: ZgService) {}

  // @Post('create')
  // createPlayer(@User() player: Player) {
  //   return this.zgService.createPlayer(player);
  // }

  @Get('games')
  getGameList() {
    return this.zgService.getGameList();
  }

  @Get('login')
  login(@Query('game_id') game_id: string, @User() player: Player) {
    return this.zgService.login(game_id, player);
  }

  @Post('logout')
  logout(@User() player: Player) {
    return this.zgService.logout(player);
  }

  @Get('balance')
  getPlayer(@User() player: Player) {
    return this.zgService.getBalance(player);
  }

  @Get('back')
  transferBack(@User() player: Player) {
    return this.zgService.transferBack(player);
  }

  @Post('records')
  fetchBetRecords(@Body('start') start, @Body('end') end) {
    return this.zgService.fetchBetRecords(new Date(start), new Date(end));
  }
}
