import { Module } from '@nestjs/common';
import { WalletRecService } from './wallet-rec.service';
import { WalletRecController } from './wallet-rec.controller';

@Module({
  controllers: [WalletRecController],
  providers: [WalletRecService],
  exports: [WalletRecService],
})
export class WalletRecModule {}
