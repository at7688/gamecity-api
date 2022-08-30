import { PayType, Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

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
  fields: { name: string; code: string }[];

  @IsEnum(PayType, { each: true })
  @IsNotEmpty()
  pay_types: PayType[];
}
