import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IdentityVarifyStatus } from '../enums';

export class UpdateIdentityDto {
  @IsEnum(IdentityVarifyStatus)
  @IsNotEmpty()
  status: IdentityVarifyStatus;

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;
}
