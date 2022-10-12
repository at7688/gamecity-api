import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDepositDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;
}
