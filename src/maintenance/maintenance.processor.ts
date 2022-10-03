import { MaintenanceService } from './maintenance.service';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Maintenance } from '@prisma/client';
import { Job, Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  GAMEPF_MAINTENANCE_END,
  GAMEPF_MAINTENANCE_START,
  GAME_MAINTENANCE_END,
  GAME_MAINTENANCE_START,
  MAIN_MAINTENANCE_END,
  MAIN_MAINTENANCE_START,
} from './cosnts';
import { MaintenanceStatus } from './enums';
import { GamePlatformStatus } from 'src/game-platform/enums';
import { GameStatus } from 'src/game/enums';

@Processor('maintenance')
export class MaintenanceProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly maintenanceService: MaintenanceService,
    @InjectQueue('maintenance')
    private readonly maintenanceQueue: Queue<Maintenance>,
  ) {}

  private readonly Logger = new Logger(MaintenanceProcessor.name);

  @Process(GAMEPF_MAINTENANCE_START)
  async gamePfMaintenanceStart(job: Job<Maintenance>) {
    const { platform_code, id } = job.data;
    const gamePlatform = await this.prisma.gamePlatform.findUnique({
      where: { code: platform_code },
    });
    if (gamePlatform.status === GamePlatformStatus.OFFLINE) {
      return;
    }
    this.Logger.debug(GAMEPF_MAINTENANCE_START);
    await Promise.all([
      this.prisma.maintenance.update({
        where: { id },
        data: {
          status: MaintenanceStatus.IN_PROGRESS,
        },
      }),
      this.prisma.gamePlatform.update({
        where: {
          code: platform_code,
        },
        data: {
          status: GamePlatformStatus.MAINTENANCE,
        },
      }),
    ]);

    return 'ok';
  }
  @Process(GAMEPF_MAINTENANCE_END)
  async gamePfMaintenanceEnd(job: Job<Maintenance>) {
    const { platform_code, id } = job.data;
    const gamePlatform = await this.prisma.gamePlatform.findUnique({
      where: { code: platform_code },
    });
    if (gamePlatform.status === GamePlatformStatus.OFFLINE) {
      return;
    }

    // 查看是否還有下一次的排程
    const delayedJobs = await this.maintenanceQueue.getJobs(['delayed']);
    const filterdJobs = delayedJobs.filter((t) => t.data.id === id);

    this.Logger.debug(GAMEPF_MAINTENANCE_END);
    await Promise.all([
      this.prisma.maintenance.update({
        where: { id },
        data: {
          status:
            filterdJobs.length > 0
              ? MaintenanceStatus.SCHEDULED
              : MaintenanceStatus.DONE,
        },
      }),
      this.prisma.gamePlatform.update({
        where: {
          code: platform_code,
        },
        data: {
          status: GamePlatformStatus.ONLINE,
        },
      }),
    ]);
    return 'ok';
  }
  @Process(GAME_MAINTENANCE_START)
  async gameMaintenanceStart(job: Job<Maintenance>) {
    const { game_id } = job.data;
    const game = await this.prisma.game.findUnique({
      where: { id: game_id },
    });
    if (game.status === GamePlatformStatus.OFFLINE) {
      return;
    }
    this.Logger.debug(GAME_MAINTENANCE_START);
    await this.prisma.game.update({
      where: { id: game_id },
      data: { status: GameStatus.MAINTENANCE },
    });
  }

  @Process(GAME_MAINTENANCE_END)
  async gameMaintenanceEnd(job: Job<Maintenance>) {
    const { game_id } = job.data;
    const game = await this.prisma.game.findUnique({
      where: { id: game_id },
    });
    if (game.status === GamePlatformStatus.OFFLINE) {
      return;
    }
    this.Logger.debug(GAME_MAINTENANCE_END);
    await this.prisma.game.update({
      where: { id: game_id },
      data: { status: GameStatus.ONLINE },
    });
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
