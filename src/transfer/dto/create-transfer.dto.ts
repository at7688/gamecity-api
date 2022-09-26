import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { TransferType } from '../enums';
export class CreateTransferDto {
  @IsNotEmpty()
  @IsEnum(TransferType)
  type: TransferType;

  @IsNotEmpty()
  username?: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsInt()
  @IsOptional()
  nums_rolling = 1; // 洗碼倍數

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;
}
