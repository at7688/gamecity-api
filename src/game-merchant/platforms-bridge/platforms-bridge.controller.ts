import { PlatformsBridgeService } from './platforms-bridge.service';
import { Controller, Get } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { PlatformType, Player } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';

@Controller('game/bridge')
@Platforms([PlatformType.PLAYER])
export class PlatformsBridgeController {
  constructor(
    private readonly platformsBridgeService: PlatformsBridgeService,
  ) {}

  @Get('allback')
  tranferAllBack(@User() player: Player) {
    return this.platformsBridgeService.tranferAllBack(player);
  }
}
