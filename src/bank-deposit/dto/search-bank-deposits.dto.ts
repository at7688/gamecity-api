import { BankDepositStatus } from 'src/bank-deposit/enums';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchBankDepositsDto extends PaginateDto {
  @IsEnum(BankDepositStatus)
  @IsOptional()
  @Transform(({ value }) => +value)
  status: BankDepositStatus;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  account?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  created_start_at?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  created_end_at?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => +value)
  amount_from?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => +value)
  amount_to?: number;
}