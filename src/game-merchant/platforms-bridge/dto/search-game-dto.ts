import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchGameDto {
  @IsString()
  @IsOptional()
  platform_code?: string;

  @IsString()
  @IsOptional()
  category_code?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
