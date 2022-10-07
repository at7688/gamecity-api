import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlatformType } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';
import { ApplicantService } from './applicant.service';
import { SearchApplicantsDto } from './dto/search-applicants.dto';

@Controller('applicant')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post('list')
  findAll(@Body() search: SearchApplicantsDto) {
    return this.applicantService.findAll(search);
  }

  @Get('queue')
  @Platforms([PlatformType.PLAYER])
  getQueue() {
    return this.applicantService.getQueue();
  }
}
