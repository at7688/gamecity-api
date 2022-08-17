import { Module } from '@nestjs/common';
import { CBankcardService } from './c-bankcard.service';
import { CBankcardController } from './c-bankcard.controller';

@Module({
  controllers: [CBankcardController],
  providers: [CBankcardService]
})
export class CBankcardModule {}
