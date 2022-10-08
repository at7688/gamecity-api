import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidateStatus } from 'src/enums';

export class ValidatePBankcardDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(ValidateStatus)
  @IsNotEmpty()
  valid_status: ValidateStatus;

  @IsOptional()
  @IsString()
  inner_note?: string;

  @IsOptional()
  @IsString()
  outter_note?: string;
}
