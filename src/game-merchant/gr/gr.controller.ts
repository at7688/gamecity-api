import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { GrService } from './gr.service';

@Controller('game/gr')
@Platforms([PlatformType.PLAYER])
export class GrController {
  constructor(private readonly grService: GrService) {}

  @Post('create')
  createPlayer(@User() player: Player) {
    return this.grService.createPlayer(player);
  }
  @Post('login')
  login(@User() player: Player) {
    return this.grService.login(player);
  }
  @Post('logout')
  logout(@User() player: Player) {
    return this.grService.logout(player);
  }
  @Post('records')
  fetchBetRecords(@Body('start') start, @Body('end') end) {
    return this.grService.fetchBetRecords(new Date(start), new Date(end));
  }
  @Get('record/:id')
  fetchBetRecord(@Param('id') id) {
    return this.grService.fetchBetRecord(id);
  }
}
