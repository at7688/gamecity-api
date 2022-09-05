import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';

@Module({
  imports: [WalletRecModule],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
