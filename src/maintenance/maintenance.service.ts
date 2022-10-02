import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import Bull, { Job, JobStatus, Queue } from 'bull';
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

@Injectable()
export class MaintenanceService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('maintenance')
    private readonly maintenanceQueue: Queue<string>,
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

    let jobs: Job<string>[];

    if (type === MaintenanceType.GAME) {
      jobs = await Promise.all([
        this.maintenanceQueue.add(GAME_MAINTENANCE_START, platform_code, {
          repeat: {
            cron: CronExpression.EVERY_10_SECONDS,
            startDate: repeat_start_at,
            endDate: repeat_end_at,
            limit: !is_repeat ? 1 : undefined,
          },
        }),
        // this.maintenanceQueue.add(GAME_MAINTENANCE_END, platform_code, {
        //   repeat: {
        //     cron: dateToCron(end_at),
        //     startDate: repeat_start_at,
        //     endDate: repeat_end_at,
        //     limit: !is_repeat ? 1 : undefined,
        //   },
        // }),
      ]);
    } else {
      jobs = await Promise.all([
        this.maintenanceQueue.add(MAIN_MAINTENANCE_START, '', {
          repeat: {
            cron: dateToCron(start_at),
            startDate: repeat_start_at,
            endDate: repeat_end_at,
            limit: !is_repeat ? 1 : undefined,
          },
        }),
        this.maintenanceQueue.add(MAIN_MAINTENANCE_END, '', {
          repeat: {
            cron: dateToCron(end_at),
            startDate: repeat_start_at,
            endDate: repeat_end_at,
            limit: !is_repeat ? 1 : undefined,
          },
        }),
      ]);
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
        job_ids: jobs.map((t) => t.id.toString().split(':')[1]),
      },
    });
    return this.prisma.success(record);
  }

  async findAll() {
    const records = await this.prisma.maintenance.findMany();

    return records;
  }

  async findJobs(status: JobStatus[]) {
    const jobs = await this.maintenanceQueue.getJobs(status);

    return jobs;
  }

  async clean() {
    const jobs = await this.maintenanceQueue.getJobs(['delayed']);
    await Promise.all(
      jobs.map((t) => this.maintenanceQueue.removeJobs(t.id.toString())),
    );
    return this.prisma.success(jobs);
  }

  async findOne(id: number) {
    const job = await this.maintenanceQueue.getJob(
      'repeat:d55563db7cf4cf51badf97527037592e:1664688980000',
    );
    return { data: job.data, opts: job.opts, id: job.id };
  }

  async update(id: number, data: UpdateMaintenanceDto) {
    // 正在跑排程的不可更新
    const {
      type,
      platform_code,
      start_at,
      end_at,
      repeat_start_at,
      repeat_end_at,
      is_repeat,
    } = data;

    const oldRecord = await this.prisma.maintenance.findUnique({
      where: { id },
    });

    await Promise.all(
      oldRecord.job_ids.map((id) =>
        this.maintenanceQueue.removeJobs(`*${id}*`),
      ),
    );

    if (type === MaintenanceType.GAME) {
      const platform = await this.prisma.gamePlatform.findUnique({
        where: { code: platform_code },
      });
      if (!platform) {
        this.prisma.error(ResCode.NOT_FOUND, '無此遊戲平台');
      }
    }

    let jobs: Job<string>[];

    if (type === MaintenanceType.GAME) {
      jobs = await Promise.all([
        this.maintenanceQueue.add(GAME_MAINTENANCE_START, platform_code, {
          repeat: {
            cron: dateToCron(start_at),
            startDate: repeat_start_at,
            endDate: repeat_end_at,
            limit: !is_repeat ? 1 : undefined,
          },
        }),
        this.maintenanceQueue.add(GAME_MAINTENANCE_END, platform_code, {
          repeat: {
            cron: dateToCron(end_at),
            startDate: repeat_start_at,
            endDate: repeat_end_at,
            limit: !is_repeat ? 1 : undefined,
          },
        }),
      ]);
    } else {
      jobs = await Promise.all([
        this.maintenanceQueue.add(MAIN_MAINTENANCE_START, '', {
          repeat: {
            cron: dateToCron(start_at),
            startDate: repeat_start_at,
            endDate: repeat_end_at,
            limit: !is_repeat ? 1 : undefined,
          },
        }),
        this.maintenanceQueue.add(MAIN_MAINTENANCE_END, '', {
          repeat: {
            cron: dateToCron(end_at),
            startDate: repeat_start_at,
            endDate: repeat_end_at,
            limit: !is_repeat ? 1 : undefined,
          },
        }),
      ]);
    }
    const record = await this.prisma.maintenance.update({
      where: {
        id,
      },
      data: {
        type,
        platform_code,
        start_at,
        end_at,
        repeat_start_at,
        repeat_end_at,
        is_repeat,
        job_ids: jobs.map((t) => t.id.toString().split(':')[1]),
      },
    });

    return this.prisma.success(record);
  }

  async remove(id: number) {
    const record = await this.prisma.maintenance.delete({
      where: { id },
    });
    await Promise.all(
      record.job_ids.map((id) => this.maintenanceQueue.removeJobs(`*${id}*`)),
    );

    return this.prisma.success(record);
  }
}
