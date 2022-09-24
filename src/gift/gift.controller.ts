import { Body, Controller, Post } from '@nestjs/common';
import { PlatformType } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';
import { SearchGiftsDto } from './dto/search-gifts.dto';
import { GiftService } from './gift.service';

@Controller('gift')
@Platforms([PlatformType.PLAYER])
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Post('list')
  findAll(@Body() search: SearchGiftsDto) {
    return this.giftService.findAll(search);
  }
}
