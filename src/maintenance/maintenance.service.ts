import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import Bull, { Job, JobStatus, Queue } from 'bull';
import { groupBy } from 'lodash';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { dateToCron } from 'src/utils';
import {
  GAME_MAINTENANCE_END,
  GAME_MAINTENANCE_START,
  MAIN_MAINTENANCE_END,
  MAIN_MAINTENANCE_START,
} from './cosnts';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { MaintenanceType } from './enums';
import { MaintenanceQueue } from './types';

@Injectable()
export class MaintenanceService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('maintenance')
    private readonly maintenanceQueue: Queue<MaintenanceQueue>,
  ) {}

  async create(data: CreateMaintenanceDto) {
    const {
      type,
      platform_code,
      start_at,
      end_at,
      repeat_start_at,
      repeat_end_at,
      is_repeat,
    } = data;

    if (type === MaintenanceType.GAME) {
      const platform = await this.prisma.gamePlatform.findUnique({
        where: { code: platform_code },
      });
      if (!platform) {
        this.prisma.error(ResCode.NOT_FOUND, '無此遊戲平台');
      }
    }

    const record = await this.prisma.maintenance.create({
      data: {
        type,
        platform_code,
        start_at,
        end_at,
        repeat_start_at,
        repeat_end_at,
        is_repeat,
      },
    });

    if (type === MaintenanceType.GAME) {
      await Promise.all([
        this.maintenanceQueue.add(
          GAME_MAINTENANCE_START,
          { record_id: record.id, platform_code },
          {
            repeat: {
              cron: dateToCron(start_at),
              startDate: repeat_start_at,
              endDate: repeat_end_at,
              limit: !is_repeat ? 1 : undefined,
            },
          },
        ),
        this.maintenanceQueue.add(
          GAME_MAINTENANCE_END,
          { record_id: record.id, platform_code },
          {
            repeat: {
              cron: dateToCron(end_at),
              startDate: repeat_start_at,
              endDate: repeat_end_at,
              limit: !is_repeat ? 1 : undefined,
            },
          },
        ),
      ]);
    } else {
      await Promise.all([
        this.maintenanceQueue.add(
          MAIN_MAINTENANCE_START,
          { record_id: record.id, platform_code },
          {
            repeat: {
              cron: dateToCron(start_at),
              startDate: repeat_start_at,
              endDate: repeat_end_at,
              limit: !is_repeat ? 1 : undefined,
            },
          },
        ),
        this.maintenanceQueue.add(
          MAIN_MAINTENANCE_END,
          { record_id: record.id, platform_code },
          {
            repeat: {
              cron: dateToCron(end_at),
              startDate: repeat_start_at,
              endDate: repeat_end_at,
              limit: !is_repeat ? 1 : undefined,
            },
          },
        ),
      ]);
    }

    return this.prisma.success(record);
  }

  async findAll() {
    const records = await this.prisma.maintenance.findMany();
    const jobs = await this.maintenanceQueue.getJobs(['delayed', 'completed']);
    const jobsMap = groupBy(jobs, (t) => t.data);

    return this.prisma.success(
      records.map((t) => ({ ...t, jobs: jobsMap[t.id] })),
    );
  }

  async findJobs(status: JobStatus[]) {
    const jobs = await this.maintenanceQueue.getJobs(status);

    return this.prisma.success(jobs);
  }

  async clean() {
    const jobs = await this.maintenanceQueue.getJobs(['delayed', 'completed']);
    await Promise.all(
      jobs.map((t) => this.maintenanceQueue.removeJobs(t.id.toString())),
    );
    return this.prisma.success(jobs);
  }

  async findOne(id: number) {
    const record = await this.prisma.maintenance.findUnique({ where: { id } });
    const jobs = await this.maintenanceQueue.getJobs(['delayed', 'completed']);
    const filterdJobs = jobs.filter((t) => t.data.record_id === id);
    return this.prisma.success({ ...record, jobs: filterdJobs });
  }

  async remove(id: number) {
    const jobs = await this.maintenanceQueue.getJobs(['delayed', 'completed']);
    const filterdJobIds = jobs
      .filter((t) => t.data.record_id === id)
      .map((t) => t.id);
    await Promise.all(
      filterdJobIds.map((id) =>
        this.maintenanceQueue.removeJobs(id.toString()),
      ),
    );

    await this.prisma.maintenance.delete({ where: { id } });

    return this.prisma.success(filterdJobIds);
  }
}
