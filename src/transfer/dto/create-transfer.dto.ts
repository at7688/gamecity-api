import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;
}
