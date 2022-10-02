import { MaintenanceService } from './maintenance.service';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Maintenance } from '@prisma/client';
import { Job, Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  GAME_MAINTENANCE_END,
  GAME_MAINTENANCE_START,
  MAIN_MAINTENANCE_END,
  MAIN_MAINTENANCE_START,
} from './cosnts';
import { MaintenanceStatus } from './enums';
import { GamePlatformStatus } from 'src/game-platform/enums';
import { MaintenanceQueue } from './types';

@Processor('maintenance')
export class MaintenanceProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly maintenanceService: MaintenanceService,
    @InjectQueue('maintenance')
    private readonly maintenanceQueue: Queue<MaintenanceQueue>,
  ) {}

  private readonly Logger = new Logger(MaintenanceProcessor.name);

  @Process(GAME_MAINTENANCE_START)
  async gameMaintenanceStart(job: Job<MaintenanceQueue>) {
    const gamePlatform = await this.prisma.gamePlatform.findUnique({
      where: { code: job.data.platform_code },
    });
    if (gamePlatform.status === GamePlatformStatus.OFFLINE) {
      return;
    }
    this.Logger.debug(GAME_MAINTENANCE_START);
    await Promise.all([
      this.prisma.maintenance.update({
        where: { id: job.data.record_id },
        data: {
          status: MaintenanceStatus.IN_PROGRESS,
        },
      }),
      this.prisma.gamePlatform.update({
        where: {
          code: job.data.platform_code,
        },
        data: {
          status: GamePlatformStatus.MAINTENANCE,
        },
      }),
    ]);

    return 'ok';
  }
  @Process(GAME_MAINTENANCE_END)
  async gameMaintenanceEnd(job: Job<MaintenanceQueue>) {
    const gamePlatform = await this.prisma.gamePlatform.findUnique({
      where: { code: job.data.platform_code },
    });
    if (gamePlatform.status === GamePlatformStatus.OFFLINE) {
      return;
    }

    this.Logger.debug(GAME_MAINTENANCE_END);
    await Promise.all([
      this.prisma.maintenance.update({
        where: { id: job.data.record_id },
        data: {
          status: MaintenanceStatus.DONE,
        },
      }),
      this.prisma.gamePlatform.update({
        where: {
          code: job.data.platform_code,
        },
        data: {
          status: GamePlatformStatus.ONLINE,
        },
      }),
    ]);
    return 'ok';
  }
  @Process(MAIN_MAINTENANCE_START)
  mainMaintenanceStart(job: Job<Maintenance>) {
    this.Logger.debug(MAIN_MAINTENANCE_START);
    console.log(job.data);
  }
  @Process(MAIN_MAINTENANCE_END)
  mainMaintenanceEnd(job: Job<Maintenance>) {
    this.Logger.debug(MAIN_MAINTENANCE_END);
    console.log(job.data);
  }
}
