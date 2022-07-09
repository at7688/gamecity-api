import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateBannerDto implements Prisma.BannerCreateInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  pc_img: string;

  @IsString()
  @IsNotEmpty()
  mb_img: string;

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
