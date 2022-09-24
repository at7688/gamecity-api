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

  @Cron(CronExpression.EVERY_MINUTE)
  async endingVerify() {
    await this.scheduleVarify(SettlementType.ENDING);
    this.Logger.debug('結算優惠申請單(活動結束結算)');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dailyVerify() {
    await this.scheduleVarify(SettlementType.DAILY);
    this.Logger.debug('結算優惠申請單(日結算)');
  }

  @Cron(CronExpression.EVERY_WEEK)
  async weeklyVerify() {
    await this.scheduleVarify(SettlementType.WEEKLY);
    this.Logger.debug('結算優惠申請單(週結算)');
  }

  async scheduleVarify(settlement_type: SettlementType) {
    const applicants = await this.prisma.applicant.findMany({
      where: {
        promotion: {
          is_active: true,
          settlement_type,
          pay_approval_type: ApprovalType.AUTO,
          end_at: {
            lt:
              settlement_type === SettlementType.ENDING
                ? new Date()
                : undefined,
          },
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
  }
}
