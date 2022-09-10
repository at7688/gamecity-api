import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { BwinService } from './bwin.service';

@Controller('game/bwin')
@Platforms([PlatformType.PLAYER])
export class BwinController {
  constructor(private readonly bwinService: BwinService) {}

  @Post('create')
  createPlayer(@User() player: Player) {
    return this.bwinService.createPlayer(player);
  }
  @Post('login')
  login(
    @Body('gameUrl') gameUrl,
    @User() player: Player,
    @Headers('Authorization') Authorization,
  ) {
    return this.bwinService.login(
      gameUrl,
      player,
      Authorization.replace('Bearer ', ''),
    );
  }
  @Post('logout')
  logout(@User() player: Player) {
    return this.bwinService.logout(player);
  }

  @Get('games')
  gameList(@Headers('Authorization') Authorization) {
    return this.bwinService.gameList(Authorization.replace('Bearer ', ''));
  }
}
