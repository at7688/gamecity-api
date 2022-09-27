import { SearchPlayerRollingDto } from './dto/search-player-rolling.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { SearchGiftsDto } from './dto/search-gifts.dto';
import { GiftService } from './gift.service';
import { Platforms } from 'src/metas/platforms.meta';
import { PlatformType } from '@prisma/client';

@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Post('list')
  findAll(@Body() search: SearchGiftsDto) {
    return this.giftService.findAll(search);
  }

  @Post('playerRollings')
  playerRolling(@Body() search: SearchPlayerRollingDto) {
    return this.giftService.playerRolling(search);
  }
}
