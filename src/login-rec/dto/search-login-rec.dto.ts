import { AnnouncementType, MemberType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchLoginRecsDto extends PaginateDto {
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
  @Transform(({ value }) => {
    return value.map(Number);
  })
  status?: number[];

  @IsIn([1, 2, 3], { each: true })
  @IsOptional()
  @Transform(({ value }) => {
    return value.map(Number);
  })
  block?: number[];

  @IsInt({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    return value.map(Number);
  })
  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     return value?.split(',').map(Number);
  //   }
  //   return value;
  // })
  layer?: number[];

  @IsDateString()
  @IsOptional()
  from_time?: string;

  @IsDateString()
  @IsOptional()
  to_time?: string;
}
