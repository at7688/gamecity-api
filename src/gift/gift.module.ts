import { Module } from '@nestjs/common';
import { GiftService } from './gift.service';
import { GiftController } from './gift.controller';
import { GiftClientController } from './gift.client.controller';
import { GiftClientService } from './gift.client.service';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';
import { GiftAgentController } from './gift.agent.controller';
import { GiftAgentService } from './gift.agent.service';

@Module({
  imports: [WalletRecModule],
  controllers: [GiftController, GiftClientController, GiftAgentController],
  providers: [GiftService, GiftClientService, GiftAgentService],
  exports: [GiftService],
})
export class GiftModule {}
