import { IsOptional, IsString } from 'class-validator';

export class SearchGameDto {
  @IsString()
  @IsOptional()
  platform_code: string;
}
