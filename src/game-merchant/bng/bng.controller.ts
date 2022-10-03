import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { BngService } from './bng.service';

@Controller('game/bng')
@Platforms([PlatformType.PLAYER])
export class BngController {
  constructor(private readonly bngService: BngService) {}

  // @Post('create')
  // createPlayer(@User() player: Player) {
  //   return this.bngService.createPlayer(player);
  // }

  @Get('games')
  getGameList() {
    return this.bngService.getGameList();
  }

  @Get('login')
  login(@Query('game_id') game_id: string, @User() player: Player) {
    return this.bngService.login(game_id, player);
  }

  @Post('logout')
  logout(@User() player: Player) {
    return this.bngService.logout(player);
  }

  @Get('balance')
  getPlayer(@User() player: Player) {
    return this.bngService.getBalance(player);
  }

  @Get('back')
  transferBack(@User() player: Player) {
    return this.bngService.transferBack(player);
  }

  @Post('records')
  fetchBetRecords(@Body('start') start, @Body('end') end) {
    return this.bngService.fetchBetRecords(new Date(start), new Date(end));
  }
}
