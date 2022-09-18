import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';
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
import { BwinTaskService } from './bwin/bwin.task.service';
import { GameMerchantService } from './game-merchant.service';
import { GrController } from './gr/gr.controller';
import { GrService } from './gr/gr.service';
import { GrTaskService } from './gr/gr.task.service';
import { OgCbController } from './og/og.cb.controller';
import { OgCbService } from './og/og.cb.service';
import { OgController } from './og/og.controller';
import { OgService } from './og/og.service';
import { OgTaskService } from './og/og.task.service';
import { PlatformsBridgeService } from './platforms-bridge/platforms-bridge.service';
import { PlatformsBridgeController } from './platforms-bridge/platforms-bridge.controller';

@Module({
  imports: [WalletRecModule, AuthModule],
  controllers: [
    AbController,
    OgController,
    OgCbController,
    AviaController,
    AviaCbController,
    BwinController,
    GrController,
    PlatformsBridgeController,
  ],
  providers: [
    AbService,
    AbTaskService,
    OgService,
    OgCbService,
    OgTaskService,
    AviaService,
    AviaCbService,
    AviaTaskService,
    BwinService,
    BwinTaskService,
    GrService,
    GameMerchantService,
    GrTaskService,
    PlatformsBridgeService,
  ],
})
export class GameMerchantModule {}
