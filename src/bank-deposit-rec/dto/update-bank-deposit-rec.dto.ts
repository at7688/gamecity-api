import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BankDepositStatus } from '../enums';

export class UpdateBankDepositRecDto {
  @IsEnum(BankDepositStatus)
  @IsOptional()
  status?: BankDepositStatus;

  @IsString()
  @IsOptional()
  note?: string;
}
