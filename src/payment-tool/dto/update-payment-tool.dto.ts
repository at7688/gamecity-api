import { PartialType } from '@nestjs/swagger';
import { CreatePaymentToolDto } from './create-payment-tool.dto';

export class UpdatePaymentToolDto extends PartialType(CreatePaymentToolDto) {}
