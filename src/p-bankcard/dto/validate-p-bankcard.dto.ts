import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidStatus } from '../enums';

export class ValidatePBankcardDto {
  @IsEnum(ValidStatus)
  @IsNotEmpty()
  valid_status: ValidStatus;

  @IsOptional()
  @IsString()
  inner_note?: string;

  @IsOptional()
  @IsString()
  outter_note?: string;
}