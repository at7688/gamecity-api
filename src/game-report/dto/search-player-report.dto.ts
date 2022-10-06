import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchPlayerReportDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at?: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at?: Date;

  @IsString()
  @IsOptional()
  username?: string;

  @IsInt({ each: true })
  @IsOptional()
  layers?: number[];

  @IsString()
  @IsOptional()
  parent_id?: string;
}
