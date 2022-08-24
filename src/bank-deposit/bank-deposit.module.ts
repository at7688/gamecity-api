import { Module } from '@nestjs/common';
import { BankDepositService } from './bank-deposit.service';
import { BankDepositController } from './bank-deposit.controller';

@Module({
  controllers: [BankDepositController],
  providers: [BankDepositService]
})
export class BankDepositModule {}
