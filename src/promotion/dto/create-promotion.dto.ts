import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  ApplyGap,
  ApprovalType,
  PromotionType,
  RollingType,
  ScheduleType,
  SettlementType,
} from '../enums';

export class GameWaterItem {
  @IsString()
  @IsNotEmpty()
  platform_code: string;

  @IsString()
  @IsNotEmpty()
  game_code: string;

  @IsNumber()
  @IsNotEmpty()
  water: number;
}

export class RechargeReward {
  @IsInt()
  @IsNotEmpty()
  recharge_amount: number;

  @IsInt()
  @IsNotEmpty()
  reward_amount: number;

  @IsNumber()
  @IsNotEmpty()
  reward_percent: number;

  @IsEnum(RollingType)
  @IsOptional()
  rolling_type?: RollingType;
}

export class CreatePromotionDto {
  @IsEnum(PromotionType)
  @IsNotEmpty()
  type: PromotionType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at: string | Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at: string | Date;

  @IsBoolean()
  @IsOptional()
  is_active = true;

  @IsEnum(ApprovalType)
  @IsNotEmpty()
  approval_type: ApprovalType;

  @IsEnum(ApplyGap)
  @IsNotEmpty()
  apply_gap: ApplyGap;

  @IsEnum(ScheduleType)
  @IsNotEmpty()
  schedule_type: ScheduleType; // 活動期間

  @IsEnum(SettlementType)
  @IsNotEmpty()
  settlement_type: SettlementType; // 結算時間

  @IsString({ each: true })
  @IsNotEmpty()
  vip_ids: string[];

  @ValidateIf((t) => t.type === PromotionType.WATER)
  @ValidateNested({ each: true })
  @Type(() => GameWaterItem)
  @IsNotEmpty()
  game_water?: GameWaterItem[];

  @ValidateIf((t) => t.type === PromotionType.WATER)
  @IsInt()
  @IsNotEmpty()
  valid_bet?: number;

  @IsInt()
  @IsNotEmpty()
  nums_rolling: number;

  @IsInt()
  @IsNotEmpty()
  reward_max: number;

  @IsInt()
  @IsNotEmpty()
  applicants_max: number;

  @IsInt()
  @IsNotEmpty()
  apply_times: number;

  @ValidateIf((t) => t.type !== PromotionType.WATER)
  @ValidateNested()
  @Type(() => RechargeReward)
  @IsNotEmpty()
  recharge_reward: RechargeReward;
}
