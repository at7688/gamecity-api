import { Module } from '@nestjs/common';
import { AbService } from './ab/ab.service';
import { AbController } from './ab/ab.controller';
import { AbCbController } from './ab/ab.cb.controller';
import { BetRecordModule } from 'src/bet-record/bet-record.module';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';

@Module({
  imports: [WalletRecModule],
  providers: [AbService],
  controllers: [AbController, AbCbController],
})
export class GameMerchantModule {}
