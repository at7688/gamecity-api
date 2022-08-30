import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDepositDto } from './create-payment-deposit.dto';

export class UpdatePaymentDepositDto extends PartialType(CreatePaymentDepositDto) {}
