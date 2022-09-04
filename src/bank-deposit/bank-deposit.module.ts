import { Module } from '@nestjs/common';
import { BankDepositService } from './bank-deposit.service';
import { BankDepositController } from './bank-deposit.controller';
import { WalletRecModule } from 'src/wallet-rec/wallet-rec.module';

@Module({
  imports: [WalletRecModule],
  controllers: [BankDepositController],
  providers: [BankDepositService],
})
export class BankDepositModule {}
