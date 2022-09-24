import { CreateApplicantDto } from './dto/create-applicant.dto';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { ApplicantService } from './applicant.service';

@Controller('applicants')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post()
  @Platforms([PlatformType.PLAYER])
  create(@Body() data: CreateApplicantDto, @User() player: Player) {
    return this.applicantService.create(data.promotion_id, player);
  }
}
