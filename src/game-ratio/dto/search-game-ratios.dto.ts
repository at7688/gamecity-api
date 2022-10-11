import { IsOptional, IsString } from 'class-validator';

export class SearchGameRatiosDto {
  @IsString()
  @IsOptional()
  agent_id: string;

  @IsString()
  @IsOptional()
  platform_code: string;

  @IsString()
  @IsOptional()
  game_code: string;
}
