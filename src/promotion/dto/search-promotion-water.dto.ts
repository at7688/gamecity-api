import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchPromotionWaterDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  platform_code: string;
}
