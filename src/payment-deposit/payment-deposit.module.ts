import { Module } from '@nestjs/common';
import { PaymentDepositService } from './payment-deposit.service';
import { PaymentDepositController } from './payment-deposit.controller';

@Module({
  controllers: [PaymentDepositController],
  providers: [PaymentDepositService]
})
export class PaymentDepositModule {}
