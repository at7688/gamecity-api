import { WithdrawClientController } from './withdraw.client.controller';
import { Module } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { WithdrawController } from './withdraw.controller';
import { WithdrawClientService } from './withdraw.client.service';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';

@Module({
  imports: [WalletRecModule],
  controllers: [WithdrawController, WithdrawClientController],
  providers: [WithdrawService, WithdrawClientService],
})
export class WithdrawModule {}
