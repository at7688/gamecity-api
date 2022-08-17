import { Module } from '@nestjs/common';
import { PBankcardService } from './p-bankcard.service';
import { PBankcardController } from './p-bankcard.controller';

@Module({
  controllers: [PBankcardController],
  providers: [PBankcardService]
})
export class PBankcardModule {}
