import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TargetType } from 'src/enums';

export class SearchPromoCode {
  @IsEnum(TargetType)
  @IsOptional()
  type?: TargetType = TargetType.PLAYER;

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
