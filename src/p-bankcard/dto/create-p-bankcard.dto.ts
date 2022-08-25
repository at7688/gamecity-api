import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePBankcardDto {
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
  img_id: number;

  @IsInt()
  @IsOptional()
  img2_id?: number;
}
