import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Maintenance } from '@prisma/client';
import { JobStatus, Queue } from 'bull';
import { groupBy } from 'lodash';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { dateToCron, dateToScheduleTips } from 'src/utils';
import {
  GAMEPF_MAINTENANCE_END,
  GAMEPF_MAINTENANCE_START,
  GAME_MAINTENANCE_END,
  GAME_MAINTENANCE_START,
  MAIN_MAINTENANCE_END,
  MAIN_MAINTENANCE_START,
} from './cosnts';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenanceType } from './enums';

@Injectable()
export class MaintenanceService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('maintenance')
    private readonly maintenanceQueue: Queue<Maintenance>,
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
      game_id,
    } = data;

    if (start_at >= end_at) {
      this.prisma.error(ResCode.DATE_ERR, '日期設定錯誤(A)');
    }
    if (repeat_start_at >= repeat_end_at) {
      this.prisma.error(ResCode.DATE_ERR, '日期設定錯誤(B)');
    }
    if (end_at > repeat_end_at) {
      this.prisma.error(ResCode.DATE_ERR, '日期設定錯誤(C)');
    }

    if (type === MaintenanceType.GAME) {
      const game = await this.prisma.game.findUnique({
        where: { id: game_id },
      });
      if (!game) {
        this.prisma.error(ResCode.NOT_FOUND, '無此遊戲');
      }
    }
    if (type === MaintenanceType.GAME_PLATFORM) {
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
        game_id,
        note: `${dateToScheduleTips(start_at)}~${dateToScheduleTips(end_at)}`,
      },
    });

    await Promise.all([
      this.maintenanceQueue.add(
        {
          [MaintenanceType.GAME]: GAME_MAINTENANCE_START,
          [MaintenanceType.GAME_PLATFORM]: GAMEPF_MAINTENANCE_START,
          [MaintenanceType.MAIN]: MAIN_MAINTENANCE_START,
        }[type],
        record,
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
        {
          [MaintenanceType.GAME]: GAME_MAINTENANCE_END,
          [MaintenanceType.GAME_PLATFORM]: GAMEPF_MAINTENANCE_END,
          [MaintenanceType.MAIN]: MAIN_MAINTENANCE_END,
        }[type],
        record,
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

    return this.prisma.success(record);
  }

  async findAll() {
    const records = await this.prisma.maintenance.findMany({
      orderBy: {
        start_at: 'desc',
      },
      include: {
        game: { select: { id: true, name: true } },
        platform: { select: { code: true, name: true } },
      },
    });
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
    const filterdJobs = jobs.filter((t) => t.data.id === id);
    return this.prisma.success({ ...record, jobs: filterdJobs });
  }

  async remove(id: number) {
    const jobs = await this.maintenanceQueue.getJobs(['delayed', 'completed']);
    const filterdJobIds = jobs.filter((t) => t.data.id === id).map((t) => t.id);
    await Promise.all(
      filterdJobIds.map((id) =>
        this.maintenanceQueue.removeJobs(id.toString()),
      ),
    );

    await this.prisma.maintenance.delete({ where: { id } });

    return this.prisma.success(filterdJobIds);
  }
}
