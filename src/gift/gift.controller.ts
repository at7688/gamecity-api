import { Body, Controller, Post } from '@nestjs/common';
import { SearchGiftsDto } from './dto/search-gifts.dto';
import { GiftService } from './gift.service';

@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Post('list')
  findAll(@Body() search: SearchGiftsDto) {
    return this.giftService.findAll(search);
  }
}
