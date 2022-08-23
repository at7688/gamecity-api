import { Module } from '@nestjs/common';
import { BankDepositRecService } from './bank-deposit-rec.service';
import { BankDepositRecController } from './bank-deposit-rec.controller';

@Module({
  controllers: [BankDepositRecController],
  providers: [BankDepositRecService]
})
export class BankDepositRecModule {}
