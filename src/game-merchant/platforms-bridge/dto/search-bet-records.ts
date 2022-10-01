import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchBetRecordsDto {
  @IsString()
  @IsNotEmpty()
  platform_code?: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at?: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at?: string;
}
