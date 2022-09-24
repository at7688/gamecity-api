import { Prisma } from '@prisma/client';
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
  Max,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  ApprovalType,
  PromotionType,
  RechargeRewardType,
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

  @IsEnum(RechargeRewardType)
  @IsNotEmpty()
  reward_type: RechargeRewardType;

  @ValidateIf((t) => t.type === RechargeRewardType.AMOUNT)
  @IsInt()
  @IsNotEmpty()
  reward_amount?: number;

  @ValidateIf((t) => t.type === RechargeRewardType.PERCENTAGE)
  @IsNumber()
  @IsNotEmpty()
  reward_percent?: number;

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

  @ValidateIf((t) => t.schedule_type !== ScheduleType.FOREVER)
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at?: string | Date;

  @ValidateIf((t) => t.schedule_type !== ScheduleType.FOREVER)
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at?: string | Date;

  @IsBoolean()
  @IsOptional()
  is_active = true;

  @IsEnum(ApprovalType)
  @IsNotEmpty()
  apply_approval_type: ApprovalType;

  @IsEnum(ApprovalType)
  @IsNotEmpty()
  pay_approval_type: ApprovalType;

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
  rolling_demand: number;

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
