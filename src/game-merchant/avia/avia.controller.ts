import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { AviaService } from './avia.service';

@Controller('game/avia')
@Platforms([PlatformType.PLAYER])
export class AviaController {
  constructor(private readonly aviaService: AviaService) {}

  @Post('create')
  createPlayer(@User() player: Player) {
    return this.aviaService.createPlayer(player);
  }
  @Post('login')
  login(@User() player: Player) {
    return this.aviaService.login(player);
  }
  @Post('logout')
  logout(@User() player: Player) {
    return this.aviaService.logout(player);
  }
  @Post('records')
  fetchBetRecords(@Body('start') start, @Body('end') end) {
    return this.aviaService.fetchBetRecords(new Date(start), new Date(end));
  }
  @Get('record/:id')
  fetchBetRecord(@Param('id') id) {
    return this.aviaService.fetchBetRecord(id);
  }
}
