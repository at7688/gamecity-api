import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';
import { BetRecordStatus } from '../enums';

export class SearchBetRecordsDto extends PaginateDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  bet_start_at?: string; //下注時間

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  bet_end_at?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  result_start_at?: string; //下注時間

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  result_end_at?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  bet_no?: string;

  // @IsString()
  // @IsOptional()
  // agent_username?: string;

  @IsEnum(BetRecordStatus, { each: true })
  @IsOptional()
  status?: BetRecordStatus[];

  @IsString({ each: true })
  @IsOptional()
  category_codes?: string[];

  @IsNumber()
  @IsOptional()
  bet_amount_min?: number;

  @IsNumber()
  @IsOptional()
  bet_amount_max?: number;

  @IsNumber()
  @IsOptional()
  win_lose_amount_min?: number;

  @IsNumber()
  @IsOptional()
  win_lose_amount_max?: number;

  // @IsInt()
  // @IsOptional()
  // win_lose_result?: number; // 0 全部, 1 贏, 2 輸

  @IsString({ each: true })
  @IsOptional()
  game_codes?: string[];
}
