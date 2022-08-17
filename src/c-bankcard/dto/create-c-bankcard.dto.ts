import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

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

  @IsInt()
  @IsNotEmpty()
  min: number;

  @IsInt()
  @IsNotEmpty()
  max: number;

  @IsInt()
  @IsNotEmpty()
  total_max: number;

  @IsInt()
  @IsNotEmpty()
  rotation_id: number;

  // @IsBoolean()
  // @IsNotEmpty()
  // is_active: boolean;
}
