import { BankDepositClientController } from './bank-deposit.client.controller';
import { Module } from '@nestjs/common';
import { BankDepositService } from './bank-deposit.service';
import { BankDepositController } from './bank-deposit.controller';
import { BankDepositClientService } from './bank-deposit.client.service';

@Module({
  controllers: [BankDepositController, BankDepositClientController],
  providers: [BankDepositService, BankDepositClientService],
})
export class BankDepositModule {}
