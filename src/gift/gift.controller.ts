import { SearchPlayerRollingDto } from './dto/search-player-rolling.dto';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { SearchGiftsDto } from './dto/search-gifts.dto';
import { GiftService } from './gift.service';
import { Platforms } from 'src/metas/platforms.meta';
import { PlatformType } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { LoginUser } from 'src/types';
import { ValidateGiftDto } from './dto/validate-gift.dto';

@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Post('list')
  @Platforms([PlatformType.AGENT])
  findAll(@Body() search: SearchGiftsDto, @User() user: LoginUser) {
    if ('admin_role_id' in user) {
      return this.giftService.findAll(search);
    } else {
      return this.giftService.findAll(search, user);
    }
  }

  @Post('update')
  @Platforms([PlatformType.AGENT])
  update(@Body() search: SearchGiftsDto, @User() user: LoginUser) {
    if ('admin_role_id' in user) {
      return this.giftService.findAll(search);
    } else {
      return this.giftService.findAll(search, user);
    }
  }

  @Post('overview')
  @Platforms([PlatformType.AGENT])
  overview(@Body() search: SearchPlayerRollingDto, @User() user: LoginUser) {
    if ('admin_role_id' in user) {
      return this.giftService.overview(search);
    } else {
      return this.giftService.overview(search, user);
    }
  }

  @Post('abandon/:id')
  abandon(@Param('id') gift_id: string) {
    return this.giftService.abandon(gift_id);
  }

  @Post('validate')
  validate(@Body() data: ValidateGiftDto) {
    return this.giftService.validate(data);
  }
}
