import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class SearchFeeReportDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at?: string; //下注時間

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  agent_username?: string;

  @IsInt({ each: true })
  @IsOptional()
  layers?: number[];

  @IsString()
  @IsOptional()
  parent_id?: string;
}
