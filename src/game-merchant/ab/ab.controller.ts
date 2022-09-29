import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { AbService } from './ab.service';

@Controller('game/ab')
@Platforms([PlatformType.PLAYER])
export class AbController {
  constructor(private readonly abService: AbService) {}

  // @Post('create')
  // createPlayer(@User() player: Player) {
  //   return this.abService.createPlayer(player);
  // }

  @Get('games')
  getGameList() {
    return this.abService.getGameList();
  }

  @Get('login')
  login(@User() player: Player) {
    return this.abService.login(player);
  }

  @Get('balance')
  getPlayer(@User() player: Player) {
    return this.abService.getBalance(player);
  }

  @Get('back')
  transferBack(@User() player: Player) {
    return this.abService.transferBack(player);
  }

  @Post('records')
  fetchBetRecords(@Body('start') start, @Body('end') end) {
    return this.abService.fetchBetRecords(new Date(start), new Date(end));
  }
  @Get('record/:id')
  fetchBetRecord(@Param('id') id) {
    return this.abService.fetchBetRecord(id);
  }
  @Get('transCheck/:trans_id')
  transferCheck(@Param('trans_id') trans_id: string) {
    return this.abService.transferCheck(trans_id);
  }
}
