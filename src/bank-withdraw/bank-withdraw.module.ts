import { Module } from '@nestjs/common';
import { BankWithdrawService } from './bank-withdraw.service';
import { BankWithdrawController } from './bank-withdraw.controller';

@Module({
  controllers: [BankWithdrawController],
  providers: [BankWithdrawService]
})
export class BankWithdrawModule {}
