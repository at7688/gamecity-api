import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
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
  @Transform(({ value }) =>
    typeof value === 'string' ? value?.split(',').map(Number) : value,
  )
  status?: number[];

  @IsIn([1, 2, 3], { each: true })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value?.split(',').map(Number) : value,
  )
  block?: number[];

  @IsInt({ each: true })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value?.split(',').map(Number) : value,
  )
  layer?: number[];

  @IsDateString()
  @IsOptional()
  from_time?: string;

  @IsDateString()
  @IsOptional()
  to_time?: string;
}
