import { Prisma } from '@prisma/client';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDepositDto {
  @IsInt()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  payway_id: string;
}
