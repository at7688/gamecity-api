import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Applicant } from '@prisma/client';
import { Job } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplicantService } from './applicant.service';

@Processor('applicant')
export class ApplicantProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly applicantService: ApplicantService,
  ) {}
  private readonly Logger = new Logger(ApplicantProcessor.name);

  // 處理結算時推送的申請單
  @Process('verify')
  async applicantVerify(queue: Job<Applicant>) {
    const { promotion_id, id } = queue.data;
    await this.applicantService.autoVerify(promotion_id, id);
  }
}
