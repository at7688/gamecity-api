import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LangType, WebPlatform } from 'src/enums';
export class CreateBannerDto {
  @IsEnum(WebPlatform)
  @IsNotEmpty()
  platform: WebPlatform;

  @IsInt()
  @IsNotEmpty()
  img_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(LangType)
  @IsNotEmpty()
  lang: LangType;

  @IsString()
  @IsOptional()
  link?: string;

  @IsBoolean()
  @IsOptional()
  is_new_win?: boolean;

  @IsBoolean()
  is_active: boolean;

  @IsInt()
  sort: number;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at?: string;
}
