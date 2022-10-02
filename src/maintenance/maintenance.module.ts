import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceProcessor } from './maintenance.processor';
import { MaintenanceTask } from './maintenance.task';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'maintenance',
    }),
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceProcessor, MaintenanceTask],
})
export class MaintenanceModule {}
