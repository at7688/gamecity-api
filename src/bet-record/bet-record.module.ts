import { Module } from '@nestjs/common';
import { WalletRecModule } from './../wallet-rec/wallet-rec.module';
import { BetRecordService } from './bet-record.service';

@Module({
  imports: [WalletRecModule],
  providers: [BetRecordService],
  exports: [BetRecordService],
})
export class BetRecordModule {}
