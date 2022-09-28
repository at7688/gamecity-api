import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SearchPromoCode {
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => +value)
  is_active?: number = 0;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  parent_username?: string;

  @IsString()
  @IsOptional()
  inviter_username?: string;
}
