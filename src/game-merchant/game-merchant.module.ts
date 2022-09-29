import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';
import { AbController } from './ab/ab.controller';
import { AbService } from './ab/ab.service';
import { AbTaskService } from './ab/ab.task.service';
import { BngController } from './bng/bng.controller';
import { BngService } from './bng/bng.service';
import { BngTaskService } from './bng/bng.task.service';
import { BwinController } from './bwin/bwin.controller';
import { BwinService } from './bwin/bwin.service';
import { BwinTaskService } from './bwin/bwin.task.service';
import { GameMerchantService } from './game-merchant.service';
import { GrController } from './gr/gr.controller';
import { GrService } from './gr/gr.service';
import { GrTaskService } from './gr/gr.task.service';
import { OgController } from './og/og.controller';
import { OgService } from './og/og.service';
import { OgTaskService } from './og/og.task.service';
import { PlatformsBridgeController } from './platforms-bridge/platforms-bridge.controller';
import { PlatformsBridgeService } from './platforms-bridge/platforms-bridge.service';
import { TransferProcessor } from './transfer/transfer.processor';
import { WmController } from './wm/wm.controller';
import { WmService } from './wm/wm.service';
import { WmTaskService } from './wm/wm.task.service';
import { ZgController } from './zg/zg.controller';
import { ZgService } from './zg/zg.service';
import { ZgTaskService } from './zg/zg.task.service';

@Module({
  imports: [
    WalletRecModule,
    AuthModule,
    BullModule.registerQueue({
      name: 'transfer',
    }),
  ],
  controllers: [
    AbController,
    BngController,
    WmController,
    ZgController,
    OgController,
    BwinController,
    GrController,
    PlatformsBridgeController,
  ],
  providers: [
    AbService,
    AbTaskService,
    BngService,
    BngTaskService,
    WmService,
    WmTaskService,
    ZgService,
    ZgTaskService,
    OgService,
    OgTaskService,
    BwinService,
    BwinTaskService,
    GrService,
    GameMerchantService,
    GrTaskService,
    PlatformsBridgeService,
    TransferProcessor,
  ],
})
export class GameMerchantModule {}
