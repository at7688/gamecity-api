import { Module } from '@nestjs/common';
import { GiftModule } from 'src/gift/gift.module';
import { ApplicantController } from './applicant.controller';
import { ApplicantService } from './applicant.service';

@Module({
  imports: [GiftModule],
  controllers: [ApplicantController],
  providers: [ApplicantService],
})
export class ApplicantModule {}
