import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ValidateStatus } from 'src/enums';
import {
  ApprovalType,
  PromotionStatus,
  PromotionType,
  SettlementType,
} from 'src/promotion/enums';

export class SearchApplicantsDto {
  @IsString()
  @IsOptional()
  promotion_id?: string;

  @IsString()
  @IsOptional()
  promotion_name?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString({ each: true })
  @IsOptional()
  vip_ids?: string[];

  @IsEnum(PromotionType, { each: true })
  @IsOptional()
  types?: PromotionType[];

  @IsEnum(ApprovalType)
  @IsOptional()
  approval_type?: ApprovalType;

  @IsEnum(SettlementType)
  @IsOptional()
  settlement_type?: SettlementType;

  @IsEnum(ValidateStatus, { each: true })
  @IsOptional()
  approval_statuses?: ValidateStatus[];

  @IsEnum(PromotionStatus)
  @IsOptional()
  promotion_status?: PromotionStatus;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  apply_start_at?: string; //申請時間

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  apply_end_at?: string;
}
