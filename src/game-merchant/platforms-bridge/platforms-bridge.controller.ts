import { SearchGameDto } from './dto/search-game-dto';
import { PlatformsBridgeService } from './platforms-bridge.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { PlatformType, Player } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';
import { LoginGameDto } from './dto/login-game-dto';
import { TransBackDto } from './dto/trans-back-dto';

@Controller('client/game')
@Platforms([PlatformType.PLAYER])
export class PlatformsBridgeController {
  constructor(
    private readonly platformsBridgeService: PlatformsBridgeService,
  ) {}

  @Post('list')
  gameList(@Body() search: SearchGameDto) {
    return this.platformsBridgeService.gameList(search);
  }

  @Post('login')
  login(@Body() data: LoginGameDto, @User() player: Player) {
    return this.platformsBridgeService.login(data, player);
  }

  @Post('transBack')
  tranferBack(@Body() data: TransBackDto, @User() player: Player) {
    return this.platformsBridgeService.transferBack(player, data);
  }
}
