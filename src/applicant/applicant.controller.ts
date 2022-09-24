import { Controller, Param, Post } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { ApplicantService } from './applicant.service';

@Controller('applicant')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post('apply/:id')
  @Platforms([PlatformType.PLAYER])
  create(@Param('id') promotion_id: string, @User() player: Player) {
    return this.applicantService.create(promotion_id, player);
  }
}
