import { Module } from '@nestjs/common';
import { WalletRecService } from './wallet-rec.service';
import { WalletRecController } from './wallet-rec.controller';
import { WalletRecClientController } from './wallet-rec.client.controller';
import { WalletRecClientService } from './wallet-rec.client.service';

@Module({
  controllers: [WalletRecController, WalletRecClientController],
  providers: [WalletRecService, WalletRecClientService],
  exports: [WalletRecService],
})
export class WalletRecModule {}
