import { Controller, Param, Post } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { GiftClientService } from './gift.client.service';

@Controller('client/gift')
@Platforms([PlatformType.PLAYER])
export class GiftClientController {
  constructor(private readonly giftService: GiftClientService) {}

  @Post('list')
  findAll(@User() player: Player) {
    return this.giftService.findAll(player);
  }
  @Post('recieve/:id')
  recieve(@Param('id') gift_id: string, @User() player: Player) {
    return this.giftService.recieve(gift_id, player);
  }
}
