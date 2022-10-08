import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Job, Queue } from 'bull';
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetVipScheduleDto } from 'src/sys-config/dto/set-vip-schedule.dto';
import { VipService } from './vip.service';

@Processor('vip')
export class VipTaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vipService: VipService,
    @InjectQueue('vip')
    private readonly vipQueue: Queue<SetVipScheduleDto>,
  ) {}
  private readonly Logger = new Logger(VipTaskService.name);

  @OnEvent('vip.scheduleUpdate')
  async checkCronUpdate(data: SetVipScheduleDto) {
    const { type, day, date, hour, minute } = data;
    const cron = `${minute} ${hour} ${type === 'month' ? date : '*'} * ${
      type === 'week' ? day : '*'
    }`;
    const jobs = await this.vipQueue.getJobs(['delayed']);

    await Promise.all(jobs.map((t) => t.remove()));

    await this.vipQueue.add('checkAndApply', data, {
      repeat: {
        cron,
      },
    });
  }

  @Process('checkAndApply')
  async checkAndApply(job: Job<SetVipScheduleDto>) {
    this.Logger.debug('VIP_CONDITION_CHECK_START');
    const { type } = job.data;
    let start: Date, end: Date;
    if (type === 'week') {
      start = startOfWeek(subWeeks(new Date(), 1));
      end = endOfWeek(subWeeks(new Date(), 1));
    }
    if (type === 'month') {
      start = startOfMonth(subMonths(new Date(), 1));
      end = endOfMonth(subMonths(new Date(), 1));
    }
    await this.vipService.checkAndApply(start, end);

    this.Logger.debug('VIP_CONDITION_CHECK_END');
  }
}
