import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PromotionType } from '../enums';

export class GameWaterItem {
  platform_code: string;
  game_code: string;
  water: string;
}

export class CreatePromotionDto {
  @IsEnum(PromotionType)
  @IsNotEmpty()
  type: PromotionType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at?: string | Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at?: string | Date;

  @IsBoolean()
  @IsOptional()
  is_active = true;

  apply_approval_type?: number;
  auto_apply_schedule?: number;
  pay_approval_type?: number;
  auto_pay_schedule?: number;
  vip_ids?: string;
  game_water?: GameWaterItem[];
  rolling_demand?: number;
  reward_max?: number;
  applicants_max?: number;
  each_apply_times?: number;
}
