import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  pc_img_id: number;

  @IsInt()
  @IsNotEmpty()
  mb_img_id: number;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_active: boolean;

  @IsInt()
  sort: number;

  @IsISO8601()
  @IsOptional()
  start_at?: string | Date;

  @IsISO8601()
  @IsOptional()
  end_at?: string | Date;
}
