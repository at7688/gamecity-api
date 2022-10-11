import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'promotion',
    }),
    BullModule.registerQueue({
      name: 'applicant',
    }),
    BullModule.registerQueue({
      name: 'maintenance',
    }),
    BullModule.registerQueue({
      name: 'vip',
    }),
  ],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}
