import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePromoCodeDto {
  @IsString()
  @IsOptional()
  note?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
