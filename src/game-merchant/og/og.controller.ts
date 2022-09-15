import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { OgService } from './og.service';

@Controller('game/og')
@Platforms([PlatformType.PLAYER])
export class OgController {
  constructor(private readonly ogService: OgService) {}

  @Post('handicaps')
  getAgentHandicaps() {
    return this.ogService.getAgentHandicaps();
  }
  @Post('create')
  createPlayer(@User() player: Player) {
    return this.ogService.createPlayer(player);
  }
  @Post('login')
  login(@User() player: Player) {
    return this.ogService.login(player);
  }
  @Post('logout')
  logout(@User() player: Player) {
    return this.ogService.logout(player);
  }

  @Post('info')
  getPlayer(@User() player: Player) {
    return this.ogService.getPlayer(player);
  }

  @Post('togles')
  getTogles() {
    return this.ogService.getTogles();
  }

  @Get('maintenance')
  getMaintenance() {
    return this.ogService.getMaintenance();
  }

  @Post('maintenance')
  setMaintenance(@Body('state') state) {
    return this.ogService.setMaintenance(state);
  }

  @Post('records')
  fetchBetRecords(@Body('start') start) {
    return this.ogService.fetchBetRecords(new Date(start));
  }
  @Get('record/:id')
  fetchBetRecord(@Param('id') id) {
    return this.ogService.fetchBetRecord(id);
  }
}
