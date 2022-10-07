import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Applicant, Promotion } from '@prisma/client';
import { Job, Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplicantStatus } from '../applicant/enums';

// TODO:處理活動狀態更新(未開始,進行中,已結束)
@Processor('promotion')
export class PromotionProcessor {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('applicant')
    private readonly applicantQueue: Queue<Applicant>,
  ) {}
  private readonly Logger = new Logger(PromotionProcessor.name);

  // 活動結算(活動結束結算,日結算,周結算), 推送申請單
  @Process('settlement')
  async promotionSettlement(queue: Job<Promotion>) {
    const { id } = queue.data;
    const applicants = await this.prisma.applicant.findMany({
      where: {
        promotion_id: id,
        status: ApplicantStatus.APPLIED,
      },
    });
    await Promise.all(
      applicants.map((t) => this.applicantQueue.add('verify', t)),
    );
  }
}
