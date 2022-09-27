import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class AgentSearchGiftsDto extends PaginateDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  send_start_at?: string; // 發送時間

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  send_end_at?: string;

  @IsString({ each: true })
  @IsOptional()
  vip_ids?: string[];
}
