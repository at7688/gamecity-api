import { Module } from '@nestjs/common';
import { GiftService } from './gift.service';
import { GiftController } from './gift.controller';
import { GiftClientController } from './gift.client.controller';
import { GiftClientService } from './gift.client.service';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';

@Module({
  imports: [WalletRecModule],
  controllers: [GiftController, GiftClientController],
  providers: [GiftService, GiftClientService],
  exports: [GiftService],
})
export class GiftModule {}
