import { Module } from '@nestjs/common';
import { AbService } from './ab/ab.service';
import { AbController } from './ab/ab.controller';

@Module({
  providers: [AbService],
  controllers: [AbController],
})
export class GameMerchantModule {}
