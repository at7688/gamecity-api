import { Module } from '@nestjs/common';
import { WalletRecModule } from './../wallet-rec/wallet-rec.module';
import { BetRecordService } from './bet-record.service';
import { BetRecordController } from './bet-record.controller';

@Module({
  imports: [WalletRecModule],
  providers: [BetRecordService],
  exports: [BetRecordService],
  controllers: [BetRecordController],
})
export class BetRecordModule {}
