import { PayType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePaywayDto {
  @IsString()
  @IsNotEmpty()
  merchant_id: string;

  @IsEnum(PayType)
  @IsNotEmpty()
  type: PayType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

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
  @IsOptional()
  deposit_max: number;

  @IsNumber()
  @IsNotEmpty()
  deposit_min: number;
}
