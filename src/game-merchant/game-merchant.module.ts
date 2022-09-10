import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';
import { AbCbController } from './ab/ab.cb.controller';
import { AbCbService } from './ab/ab.cb.service';
import { AbController } from './ab/ab.controller';
import { AbService } from './ab/ab.service';
import { AviaCbController } from './avia/avia.cb.controller';
import { AviaCbService } from './avia/avia.cb.service';
import { AviaController } from './avia/avia.controller';
import { AviaService } from './avia/avia.service';
import { BwinCbController } from './bwin/bwin.cb.controller';
import { BwinCbService } from './bwin/bwin.cb.service';
import { BwinController } from './bwin/bwin.controller';
import { BwinService } from './bwin/bwin.service';

@Module({
  imports: [WalletRecModule, AuthModule],
  controllers: [
    AbController,
    AbCbController,
    AviaController,
    AviaCbController,
    BwinController,
    BwinCbController,
  ],
  providers: [
    AbService,
    AbCbService,
    AviaService,
    AviaCbService,
    BwinService,
    BwinCbService,
  ],
})
export class GameMerchantModule {}
