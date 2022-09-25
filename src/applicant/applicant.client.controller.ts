import { Controller, Get, Post } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { ApplicantClientService } from './applicant.client.service';

@Controller('client/applicants')
@Platforms([PlatformType.PLAYER])
export class ApplicantClientController {
  constructor(private readonly applicantService: ApplicantClientService) {}

  @Get()
  findAll(@User() player: Player) {
    return this.applicantService.findAll(player);
  }
}
