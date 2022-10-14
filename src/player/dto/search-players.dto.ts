import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsDate,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchPlayersDto extends PaginateDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString({ each: true })
  vip_ids: string[];

  @IsIn([0, 1, 2])
  @IsOptional()
  is_blocked?: number;

  @IsIn([0, 1, 2])
  @IsOptional()
  is_lock_bet?: number;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  created_start_at?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  created_end_at?: string;

  @IsOptional()
  @IsString()
  inviter_id: string;

  @IsOptional()
  @IsString()
  agent_id: string;

  @IsOptional()
  @IsBooleanString()
  is_all: boolean; // agent_id + is_all -> 撈全部下層玩家
}
