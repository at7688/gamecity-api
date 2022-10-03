import { PartialType } from '@nestjs/swagger';
import { CreateSmsMerchantDto } from './create-sms-merchant.dto';

export class UpdateSmsMerchantDto extends PartialType(CreateSmsMerchantDto) {}
