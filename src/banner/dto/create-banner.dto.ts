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

  // @IsNotEmpty()
  // pc_img: string;

  // @IsString()
  // @IsNotEmpty()
  // mb_img: string;

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
