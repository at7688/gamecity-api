import { Prisma, PayType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentFeeType } from '../enums';

export class Payment {
  @IsString()
  @IsOptional()
  id?: string;

  @IsEnum(PayType)
  @IsNotEmpty()
  type: PayType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(PaymentFeeType)
  @IsNotEmpty()
  fee_type: PaymentFeeType;

  @IsNumber()
  @IsOptional()
  player_fee_amount: number;

  @IsNumber()
  @IsOptional()
  player_fee_percent: number;

  @IsNumber()
  @IsOptional()
  player_fee_min: number;

  @IsNumber()
  @IsOptional()
  player_fee_max: number;

  @IsNumber()
  @IsOptional()
  fee_amount: number;

  @IsNumber()
  @IsOptional()
  fee_percent: number;

  @IsNumber()
  @IsOptional()
  fee_min: number;

  @IsNumber()
  @IsOptional()
  fee_max: number;

  @IsNumber()
  @IsNotEmpty()
  deposit_max: number;

  @IsNumber()
  @IsNotEmpty()
  deposit_min: number;

  @IsBoolean()
  @IsOptional()
  is_active = true;
}

export class CreatePaymentToolDto {
  @IsString()
  @IsNotEmpty()
  tool_name: string;

  @IsBoolean()
  @IsOptional()
  is_active = true;

  @IsInt()
  @IsNotEmpty()
  recharge_max: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsInt()
  @IsNotEmpty()
  rotation_id: number;

  @IsString()
  @IsNotEmpty()
  merchant_id: string;

  @ValidateNested({ each: true })
  @Type(() => Payment)
  payways?: Payment[];

  @IsInt()
  @IsOptional()
  sort?: number;

  @IsObject()
  @IsNotEmpty()
  merchant_config: Prisma.InputJsonObject;
}
