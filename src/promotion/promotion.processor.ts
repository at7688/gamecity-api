import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addSeconds,
} from 'date-fns';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Applicant, Promotion } from '@prisma/client';
import { Job, Queue } from 'bull';
import { ValidateStatus } from 'src/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleType } from './enums';

// TODO:處理活動狀態更新(未開始,進行中,已結束)
@Processor('promotion')
export class PromotionProcessor {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('applicant')
    private readonly applicantQueue: Queue<Applicant>,
    @InjectQueue('promotion')
    private readonly promotionQueue: Queue<Promotion>,
  ) {}
  private readonly Logger = new Logger(PromotionProcessor.name);

  // 活動結算(活動結束結算,日結算,周結算), 推送申請單
  @Process('settlement')
  async promotionSettlement(queue: Job<Promotion>) {
    this.Logger.log('RPOMOTION_SETTLEMENT_START');
    const { id, schedule_type } = queue.data;
    const applicants = await this.prisma.applicant.findMany({
      where: {
        promotion_id: id,
        status: ValidateStatus.UNPROCESSED,
      },
    });
    await Promise.all(
      applicants.map((t) => this.applicantQueue.add('verify', t)),
    );

    // 自動延續類型
    if (schedule_type >= 10) {
      const dateMap: Record<
        number,
        () => {
          start_at: Date;
          end_at: Date;
        }
      > = {
        [ScheduleType.AUTO_EXTEND_A_DAY]: () => ({
          start_at: startOfDay(new Date()),
          end_at: endOfDay(new Date()),
        }),
        [ScheduleType.AUTO_EXTEND_A_WEEK]: () => ({
          start_at: startOfWeek(new Date()),
          end_at: endOfWeek(new Date()),
        }),
        [ScheduleType.AUTO_EXTEND_A_MONTH]: () => ({
          start_at: startOfMonth(new Date()),
          end_at: endOfMonth(new Date()),
        }),
      };
      const { start_at, end_at } = dateMap[schedule_type]();
      const record = await this.prisma.promotion.update({
        where: { id },
        data: {
          start_at,
          end_at,
        },
      });
      // 推到自動審核排程
      await this.promotionQueue.add('settlement', record, {
        repeat: {
          cron: '* * * * * *',
          startDate: addSeconds(record.end_at, 10),
          limit: 1,
        },
      });
      this.Logger.log('RPOMOTION_SETTLEMENT_END');
    }
  }
}
