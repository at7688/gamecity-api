import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { BetRecordStatus } from 'src/bet-record/enums';

export class SearchGameReportsDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  bet_start_at?: string; //下注時間

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  bet_end_at?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  agent_username?: string;

  @IsString({ each: true })
  @IsOptional()
  category_codes?: string[];

  @IsString({ each: true })
  @IsOptional()
  game_ids?: string[];

  @IsEnum(BetRecordStatus, { each: true })
  @IsOptional()
  status?: BetRecordStatus[];
}
