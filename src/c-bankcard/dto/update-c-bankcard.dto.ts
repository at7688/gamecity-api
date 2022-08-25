import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateCBankcardDto } from './create-c-bankcard.dto';

export class UpdateCBankcardDto {
  @IsString()
  @IsOptional()
  bank_code?: string;

  @IsString()
  @IsOptional()
  branch?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  account?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsOptional()
  deposit_max?: number;

  @IsInt()
  @IsOptional()
  deposit_min?: number;

  @IsInt()
  @IsOptional()
  recharge_max?: number;

  @IsInt()
  @IsOptional()
  rotation_id?: number;

  @IsInt()
  @IsOptional()
  sort?: number;

  @IsBoolean()
  @IsOptional()
  is_current?: boolean;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  accumulate_from?: Date;
}
