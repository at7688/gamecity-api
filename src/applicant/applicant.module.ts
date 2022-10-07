import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { GiftModule } from 'src/gift/gift.module';
import { ApplicantClientController } from './applicant.client.controller';
import { ApplicantClientService } from './applicant.client.service';
import { ApplicantController } from './applicant.controller';
import { ApplicantProcessor } from './applicant.processor';
import { ApplicantService } from './applicant.service';

@Module({
  imports: [
    GiftModule,
    BullModule.registerQueue({
      name: 'applicant',
    }),
  ],
  controllers: [ApplicantController, ApplicantClientController],
  providers: [ApplicantService, ApplicantClientService, ApplicantProcessor],
  exports: [ApplicantService],
})
export class ApplicantModule {}
