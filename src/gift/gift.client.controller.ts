import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientSearchGiftsDto } from './dto/client-search-gifts.dto';
import { GiftClientService } from './gift.client.service';
import { GiftService } from './gift.service';

@Controller('client/gift')
@Platforms([PlatformType.PLAYER])
export class GiftClientController {
  constructor(
    private readonly giftService: GiftService,
    private readonly giftClientService: GiftClientService,
  ) {}

  @Post('list')
  async findAll(@Body() search: ClientSearchGiftsDto, @User() player: Player) {
    return this.giftClientService.findAll(search, player);
  }
  @Post(':id/recieve')
  recieve(@Param('id') gift_id: string, @User() player: Player) {
    return this.giftClientService.recieve(gift_id, player);
  }

  @Post(':id/abandon')
  abandon(@Param('id') gift_id: string, @User() player: Player) {
    return this.giftClientService.abandon(gift_id, player);
  }
}
