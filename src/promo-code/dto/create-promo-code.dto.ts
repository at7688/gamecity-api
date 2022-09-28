import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TargetType } from 'src/enums';

export class CreatePromoCodeDto {
  @IsEnum(TargetType)
  @IsOptional()
  type: TargetType;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  parent_id: string; // 代理

  @IsString()
  @IsOptional()
  inviter_id?: string; // 推薦會員

  @IsString()
  @IsOptional()
  note?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
