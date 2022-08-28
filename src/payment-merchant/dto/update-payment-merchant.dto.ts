import { PartialType } from '@nestjs/swagger';
import { CreatePaymentMerchantDto } from './create-payment-merchant.dto';

export class UpdatePaymentMerchantDto extends PartialType(CreatePaymentMerchantDto) {}
