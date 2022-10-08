import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Job, Queue } from 'bull';
import { endOfMonth, startOfMonth, subDays } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { VipService } from './vip.service';

@Processor('vip')
export class VipTaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vipService: VipService,
    @InjectQueue('vip')
    private readonly vipQueue: Queue<string>,
  ) {}
  private readonly Logger = new Logger(VipTaskService.name);

  @OnEvent('vip.scheduleUpdate')
  async checkCronUpdate(cron: string) {
    const jobs = await this.vipQueue.getJobs(['delayed']);

    await Promise.all(jobs.map((t) => t.remove()));

    await this.vipQueue.add('checkAndApply', cron, {
      repeat: {
        cron,
      },
    });
  }

  @Process('checkAndApply')
  async checkAndApply(payload: Job<string>) {
    await this.vipService.checkAndApply(
      startOfMonth(subDays(new Date(), 1)),
      endOfMonth(subDays(new Date(), 1)),
    );

    this.Logger.debug('VIP_CONDITION_CHECK');
  }
}
