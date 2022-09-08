import { Module } from '@nestjs/common';
import { AbService } from './ab/ab.service';
import { AbController } from './ab/ab.controller';
import { AbCbController } from './ab/ab.cb.controller';

@Module({
  providers: [AbService],
  controllers: [AbController, AbCbController],
})
export class GameMerchantModule {}
