import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidateStatus } from 'src/enums';

export class UpdateIdentityDto {
  @IsEnum(ValidateStatus)
  @IsNotEmpty()
  status: ValidateStatus;

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;
}
