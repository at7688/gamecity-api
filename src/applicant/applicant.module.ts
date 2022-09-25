import { Module } from '@nestjs/common';
import { GiftModule } from 'src/gift/gift.module';
import { ApplicantClientController } from './applicant.client.controller';
import { ApplicantClientService } from './applicant.client.service';
import { ApplicantController } from './applicant.controller';
import { ApplicantService } from './applicant.service';
import { ApplicantTaskService } from './applicant.task.service';

@Module({
  imports: [GiftModule],
  controllers: [ApplicantController, ApplicantClientController],
  providers: [ApplicantService, ApplicantTaskService, ApplicantClientService],
})
export class ApplicantModule {}
