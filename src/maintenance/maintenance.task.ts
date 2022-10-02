import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Maintenance } from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MaintenanceTask {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('maintenance')
    private readonly maintenanceQueue: Queue<Maintenance>,
  ) {}

  // regularStart(platform_code: string) {
  //   this.maintenanceQueue.add('regular', {
  //     platform_code,
  //   });
  // }
}
