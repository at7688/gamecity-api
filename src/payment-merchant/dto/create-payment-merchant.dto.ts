import { PayType, Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

interface MerchantField {
  name: string;
  code: string;
}
export class CreatePaymentMerchantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsBoolean()
  @IsOptional()
  is_active = true;

  @IsObject({ each: true })
  @IsNotEmpty()
  fields: MerchantField[];
}
