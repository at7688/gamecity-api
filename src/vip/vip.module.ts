import { Module } from '@nestjs/common';
import { VipService } from './vip.service';
import { VipController } from './vip.controller';
import { VipTaskService } from './vip.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'vip',
    }),
  ],
  controllers: [VipController],
  providers: [VipService, VipTaskService],
})
export class VipModule {}
