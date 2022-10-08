import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BankDepositStatus } from 'src/bank-deposit/enums';

export class UpdateBankDepositDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(BankDepositStatus)
  @IsOptional()
  status?: BankDepositStatus;

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;
}
