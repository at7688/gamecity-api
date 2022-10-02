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

@Processor('maintenance')
export class MaintenanceProcessor {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('maintenance')
    private readonly maintenanceQueue: Queue<Maintenance>,
  ) {}

  private readonly Logger = new Logger(MaintenanceProcessor.name);

  @Process(GAME_MAINTENANCE_START)
  gameMaintenanceStart(job: Job<Maintenance>) {
    this.Logger.debug(GAME_MAINTENANCE_START);
    console.log(job.data);
  }
  @Process(GAME_MAINTENANCE_END)
  gameMaintenanceEnd(job: Job<Maintenance>) {
    this.Logger.debug(GAME_MAINTENANCE_END);
    console.log(job.data);
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
