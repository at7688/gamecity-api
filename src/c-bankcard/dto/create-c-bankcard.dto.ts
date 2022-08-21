import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCBankcardDto {
  @IsString()
  @IsNotEmpty()
  bank_code: string;

  @IsString()
  @IsNotEmpty()
  branch: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  account: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsNotEmpty()
  deposit_max: number;

  @IsInt()
  @IsNotEmpty()
  deposit_min: number;

  @IsInt()
  @IsNotEmpty()
  recharge_max: number;

  @IsInt()
  @IsNotEmpty()
  rotation_id: number;

  @IsInt()
  @IsOptional()
  sort?: number;

  @IsBoolean()
  @IsNotEmpty()
  is_rotate?: boolean;
}
