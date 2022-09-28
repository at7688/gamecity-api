import { Module } from '@nestjs/common';
import { VipService } from './vip.service';
import { VipController } from './vip.controller';
import { VipTaskService } from './vip.task.service';

@Module({
  controllers: [VipController],
  providers: [VipService, VipTaskService],
})
export class VipModule {}
