import { Body, Controller, Post } from '@nestjs/common';
import { Member, PlatformType } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { CreateGiftDto } from './dto/create-gift.dto';
import { GiftAgentService } from './gift.agent.service';

@Controller('agent/gift')
@Platforms([PlatformType.AGENT])
export class GiftAgentController {
  constructor(private readonly giftService: GiftAgentService) {}

  @Post('create')
  async create(@Body() data: CreateGiftDto, @User() agent: Member) {
    return this.giftService.create(data, agent);
  }
}
