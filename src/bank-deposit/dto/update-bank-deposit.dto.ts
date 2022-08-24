import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BankDepositStatus } from 'src/bank-deposit/enums';

export class UpdateBankDepositDto {
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
