import { ApiProperty } from '@nestjs/swagger';
import { AnnouncementType, Prisma } from '@prisma/client';
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

export class CreateAnnouncementDto implements Prisma.AnnouncementCreateInput {
  @IsNotEmpty()
  @IsEnum(AnnouncementType)
  @ApiProperty({ enum: AnnouncementType })
  type: AnnouncementType;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: '測試標題' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: '測試內容' })
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
