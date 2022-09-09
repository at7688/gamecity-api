import { Module } from '@nestjs/common';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';
import { AbCbController } from './ab/ab.cb.controller';
import { AbCbService } from './ab/ab.cb.service';
import { AbController } from './ab/ab.controller';
import { AbService } from './ab/ab.service';
import { AviaCbController } from './avia/avia.cb.controller';
import { AviaCbService } from './avia/avia.cb.service';
import { AviaController } from './avia/avia.controller';
import { AviaService } from './avia/avia.service';

@Module({
  imports: [WalletRecModule],
  controllers: [AbController, AbCbController, AviaController, AviaCbController],
  providers: [AbService, AbCbService, AviaService, AviaCbService],
})
export class GameMerchantModule {}
