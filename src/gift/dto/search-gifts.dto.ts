import { IsOptional, IsString } from 'class-validator';

export class SearchGiftsDto {
  @IsString()
  @IsOptional()
  promotion_id?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString({ each: true })
  @IsOptional()
  vip_ids?: string[];
}
