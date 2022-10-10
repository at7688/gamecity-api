import { PlatformType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchLoginRecsDto extends PaginateDto {
  @IsEnum(PlatformType)
  @IsOptional()
  platform?: PlatformType;

  @IsString()
  @IsOptional()
  ip?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsIn([1, 2], { each: true })
  @IsOptional()
  status?: number[];

  @IsIn([1, 2, 3], { each: true })
  @IsOptional()
  block?: number[];

  @IsInt({ each: true })
  @IsOptional()
  layer?: number[];

  @IsDateString()
  @IsOptional()
  from_time?: string;

  @IsDateString()
  @IsOptional()
  to_time?: string;
}
