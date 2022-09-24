import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApprovalType, SettlementType } from 'src/promotion/enums';
import { ApplicantService } from './applicant.service';
import { ApplicantStatus } from './enums';

@Injectable()
export class ApplicantTaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly applicantService: ApplicantService,
  ) {}
  private readonly Logger = new Logger(ApplicantTaskService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Timeout(3000)
  async dailyVarify() {
    const applicants = await this.prisma.applicant.findMany({
      where: {
        promotion: {
          is_active: true,
          settlement_type: SettlementType.DAILY,
          pay_approval_type: ApprovalType.AUTO,
        },
        status: ApplicantStatus.APPLIED,
      },
      include: {
        promotion: true,
      },
    });

    await Promise.all(
      applicants.map((t) => {
        return this.applicantService.autoVerify(t.promotion_id, t.id);
      }),
    );
    this.Logger.debug('結算優惠申請單(日結算)');
  }
}
