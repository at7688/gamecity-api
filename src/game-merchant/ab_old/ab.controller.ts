import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { AbService } from './ab.service';

@Controller('game/ab')
@Platforms([PlatformType.PLAYER])
export class AbController {
  constructor(private readonly abService: AbService) {}

  @Post('handicaps')
  getAgentHandicaps() {
    return this.abService.getAgentHandicaps();
  }
  @Post('create')
  createPlayer(@User() player: Player) {
    return this.abService.createPlayer(player);
  }
  @Post('login')
  login(@User() player: Player) {
    return this.abService.login(player);
  }
  @Post('logout')
  logout(@User() player: Player) {
    return this.abService.logout(player);
  }

  @Post('info')
  getPlayer(@User() player: Player) {
    return this.abService.getPlayer(player);
  }

  @Post('tables')
  getTables() {
    return this.abService.getTables();
  }

  @Get('maintenance')
  getMaintenance() {
    return this.abService.getMaintenance();
  }

  @Post('maintenance')
  setMaintenance(@Body('state') state) {
    return this.abService.setMaintenance(state);
  }

  @Post('records')
  fetchBetRecords(@Body('start') start) {
    return this.abService.fetchBetRecords(new Date(start));
  }
  @Get('record/:id')
  fetchBetRecord(@Param('id') id) {
    return this.abService.fetchBetRecord(id);
  }
}
