import { CreateApplicantDto } from './dto/create-applicant.dto';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { ApplicantService } from './applicant.service';
import { SearchApplicantsDto } from './dto/search-applicants.dto';

@Controller('applicants')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post('list')
  findAll(@Body() search: SearchApplicantsDto, @User() player: Player) {
    return this.applicantService.findAll(search);
  }

  @Post('create')
  @Platforms([PlatformType.PLAYER])
  create(@Body() data: CreateApplicantDto, @User() player: Player) {
    return this.applicantService.create(data.promotion_id, player);
  }
}
