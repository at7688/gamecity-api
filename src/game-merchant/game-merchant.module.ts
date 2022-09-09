import { Module } from '@nestjs/common';
import { AbService } from './ab/ab.service';
import { AbController } from './ab/ab.controller';
import { AbCbController } from './ab/ab.cb.controller';
import { BetRecordModule } from 'src/bet-record/bet-record.module';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';
import { AviaService } from './avia/avia.service';
import { AviaController } from './avia/avia.controller';
import { AviaCbController } from './avia/avia.cb.controller';

@Module({
  imports: [WalletRecModule],
  providers: [AbService, AviaService],
  controllers: [AbController, AbCbController, AviaController, AviaCbController],
})
export class GameMerchantModule {}
