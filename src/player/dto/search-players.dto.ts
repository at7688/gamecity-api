import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsIn, IsOptional, IsString } from 'class-validator';
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
  @Transform(({ value }) =>
    typeof value === 'string' ? value?.split(',').map((s) => s.trim()) : value,
  )
  vip_ids: string[];

  @IsIn([0, 1, 2])
  @IsOptional()
  @Transform(({ value }) => +value)
  is_blocked?: number;

  @IsIn([0, 1, 2])
  @IsOptional()
  @Transform(({ value }) => +value)
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
}
