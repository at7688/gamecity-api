import { IsOptional, IsString } from 'class-validator';

export class SearchGameRatiosDto {
  @IsString()
  @IsOptional()
  platform_code: string;

  @IsString()
  @IsOptional()
  game_code: string;
}
