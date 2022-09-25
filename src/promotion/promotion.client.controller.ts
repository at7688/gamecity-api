import { Controller, Get } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { PromotionClientService } from './promotion.client.service';

@Controller('client/promotions')
@Platforms([PlatformType.PLAYER])
export class PromotionClientController {
  constructor(private readonly promotionService: PromotionClientService) {}

  @Get()
  findAll(@User() player: Player) {
    return this.promotionService.findAll(player);
  }
}
