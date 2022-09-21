import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { OgService } from './og.service';

@Controller('game/og')
@Platforms([PlatformType.PLAYER])
export class OgController {
  constructor(private readonly ogService: OgService) {}

  // @Post('create')
  // createPlayer(@User() player: Player) {
  //   return this.ogService.createPlayer(player);
  // }

  @Get('games')
  getGameList() {
    return this.ogService.getGameList();
  }

  @Get('login')
  login(@Query('game_id') game_id: string, @User() player: Player) {
    return this.ogService.login(game_id, player);
  }

  @Get('balance')
  getPlayer(@User() player: Player) {
    return this.ogService.getBalance(player);
  }

  @Get('back')
  transferBack(@User() player: Player) {
    return this.ogService.transferBack(player);
  }

  @Post('records')
  fetchBetRecords(@Body('start') start, @Body('end') end) {
    return this.ogService.fetchBetRecords(new Date(start), new Date(end));
  }
  @Get('record/:id')
  fetchBetRecord(@Param('id') id) {
    return this.ogService.fetchBetRecord(id);
  }
}
