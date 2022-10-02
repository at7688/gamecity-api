import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Maintenance } from '@prisma/client';
import { Queue } from 'bull';
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
        this.maintenanceQueue.add(GAME_MAINTENANCE_START, record, {
          repeat: {
            cron: dateToCron(start_at),
            startDate: repeat_start_at,
            endDate: repeat_end_at,
            limit: is_repeat ? 1 : undefined,
          },
        }),
        this.maintenanceQueue.add(GAME_MAINTENANCE_END, record, {
          repeat: {
            cron: dateToCron(end_at),
            startDate: repeat_start_at,
            endDate: repeat_end_at,
            limit: is_repeat ? 1 : undefined,
          },
        }),
      ]);
    } else {
      await Promise.all([
        this.maintenanceQueue.add(MAIN_MAINTENANCE_START, record, {
          repeat: {
            cron: dateToCron(start_at),
            startDate: repeat_start_at,
            endDate: repeat_end_at,
            limit: is_repeat ? 1 : undefined,
          },
        }),
        this.maintenanceQueue.add(MAIN_MAINTENANCE_END, record, {
          repeat: {
            cron: dateToCron(end_at),
            startDate: repeat_start_at,
            endDate: repeat_end_at,
            limit: is_repeat ? 1 : undefined,
          },
        }),
      ]);
    }
  }

  async findAll() {
    const result = await this.maintenanceQueue.getJobs(['completed']);
    return result.map((t) => ({ data: t.data, opts: t.opts, id: t.id }));
  }

  async findOne(id: number) {
    const job = await this.maintenanceQueue.getJob(
      'repeat:d55563db7cf4cf51badf97527037592e:1664688980000',
    );
    return { data: job.data, opts: job.opts, id: job.id };
  }

  async update(id: number, data: UpdateMaintenanceDto) {
    const { platform_code, start_at, end_at } = data;
    const record = await this.prisma.maintenance.update({
      where: {
        id,
      },
      data: {
        type: MaintenanceType.GAME,
        platform_code,
        start_at,
        end_at,
      },
    });
    const job = await this.maintenanceQueue.getJob(id);
    job.update(record);
  }

  remove(id: number) {
    return `This action removes a #${id} maintenance`;
  }
}
