import { Module } from '@nestjs/common';
import { PaymentDepositController } from './payment-deposit.controller';
import { PaymentDepositService } from './payment-deposit.service';

@Module({
  controllers: [PaymentDepositController],
  providers: [PaymentDepositService],
  exports: [PaymentDepositService],
})
export class PaymentDepositModule {}
