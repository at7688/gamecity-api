import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';
import { DepositStatus } from 'src/enums';

export class SearchPaymentDepositsDto extends PaginateDto {
  @IsEnum(DepositStatus)
  @IsOptional()
  status: DepositStatus;

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
  amount_from?: number;

  @IsNumber()
  @IsOptional()
  amount_to?: number;
}
