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

@Controller('client/gifts')
@Platforms([PlatformType.PLAYER])
export class GiftClientController {
  constructor(private readonly giftService: GiftClientService) {}

  @Post('list')
  async findAll(@Body() search: ClientSearchGiftsDto, @User() player: Player) {
    return this.giftService.findAll(search, player);
  }
  @Post(':id/recieve')
  recieve(@Param('id') gift_id: string, @User() player: Player) {
    return this.giftService.recieve(gift_id, player);
  }
}
