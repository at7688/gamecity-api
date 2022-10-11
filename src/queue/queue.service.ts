import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Applicant, Maintenance, Promotion } from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetVipScheduleDto } from 'src/sys-config/dto/set-vip-schedule.dto';
import { SearchQueueDto } from './dto/search-queue.dto';

@Injectable()
export class QueueService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('promotion')
    private readonly promotionQueue: Queue<Promotion>,
    @InjectQueue('applicant')
    private readonly applicantQueue: Queue<Applicant>,
    @InjectQueue('maintenance')
    private readonly maintenanceQueue: Queue<Maintenance>,
    @InjectQueue('vip')
    private readonly vipQueue: Queue<SetVipScheduleDto>,
  ) {}

  async getQueue(data: SearchQueueDto) {
    const { type, statuses } = data;
    if (type === 'promotion') {
      const jobs = await this.promotionQueue.getJobs(statuses);
      return this.prisma.success(jobs);
    }
    if (type === 'applicant') {
      const jobs = await this.applicantQueue.getJobs(statuses);
      return this.prisma.success(jobs);
    }
    if (type === 'vip') {
      const jobs = await this.vipQueue.getJobs(statuses);
      return this.prisma.success(jobs);
    }
    if (type === 'maintenance') {
      const jobs = await this.maintenanceQueue.getJobs(statuses);
      return this.prisma.success(jobs);
    }
  }
}
