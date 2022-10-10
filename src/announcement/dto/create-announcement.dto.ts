import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { AnnouncementType } from '../enums';

export class CreateAnnouncementDto {
  @IsNotEmpty()
  @IsEnum(AnnouncementType)
  type: AnnouncementType;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty()
  @IsISO8601()
  @IsOptional()
  start_at: Date;

  @ApiProperty()
  @IsISO8601()
  @IsOptional()
  end_at: Date;

  @ApiProperty({ default: true })
  @IsBoolean()
  is_active: boolean;

  @IsString()
  @IsOptional()
  link: string;

  @IsBoolean()
  @IsOptional()
  is_new_win: boolean;

  @IsInt()
  @IsOptional()
  sort: number;

  @IsBoolean()
  @IsOptional()
  is_top: boolean;
}
