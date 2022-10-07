import { Module } from '@nestjs/common';
import { PaymentToolService } from './payment-tool.service';
import { PaymentToolController } from './payment-tool.controller';

@Module({
  controllers: [PaymentToolController],
  providers: [PaymentToolService],
})
export class PaymentToolModule {}
