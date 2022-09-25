import { Body, Controller, Post } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { SearchApplicantsDto } from './dto/search-applicants.dto';

@Controller('applicants')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post('list')
  findAll(@Body() search: SearchApplicantsDto) {
    return this.applicantService.findAll(search);
  }
}
