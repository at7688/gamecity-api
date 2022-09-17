import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';
import { AbCbController } from './ab/ab.cb.controller';
import { AbCbService } from './ab/ab.cb.service';
import { AbController } from './ab/ab.controller';
import { AbService } from './ab/ab.service';
import { AbTaskService } from './ab/ab.task.service';
import { AviaCbController } from './avia/avia.cb.controller';
import { AviaCbService } from './avia/avia.cb.service';
import { AviaController } from './avia/avia.controller';
import { AviaService } from './avia/avia.service';
import { AviaTaskService } from './avia/avia.task.service';
import { BwinController } from './bwin/bwin.controller';
import { BwinService } from './bwin/bwin.service';
import { GameMerchantService } from './game-merchant.service';
import { GrController } from './gr/gr.controller';
import { GrService } from './gr/gr.service';
import { OgCbController } from './og/og.cb.controller';
import { OgCbService } from './og/og.cb.service';
import { OgController } from './og/og.controller';
import { OgService } from './og/og.service';
import { OgTaskService } from './og/og.task.service';

@Module({
  imports: [WalletRecModule, AuthModule],
  controllers: [
    AbController,
    AbCbController,
    OgController,
    OgCbController,
    AviaController,
    AviaCbController,
    BwinController,
    GrController,
  ],
  providers: [
    AbService,
    AbCbService,
    AbTaskService,
    OgService,
    OgCbService,
    OgTaskService,
    AviaService,
    AviaCbService,
    AviaTaskService,
    BwinService,
    GrService,
    GameMerchantService,
  ],
})
export class GameMerchantModule {}
