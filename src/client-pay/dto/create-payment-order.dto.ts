import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePaymentOrderDto {
  @IsInt()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  payway_id: string;

  @IsBoolean()
  @IsOptional()
  is_test: boolean;
}
