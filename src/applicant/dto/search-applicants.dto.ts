import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  ApprovalType,
  PromotionStatus,
  PromotionType,
  SettlementType,
} from 'src/promotion/enums';
import { ApplicantStatus } from '../enums';

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
  apply_approval_type?: ApprovalType;

  @IsEnum(SettlementType)
  @IsOptional()
  settlement_type?: SettlementType;

  @IsEnum(ApplicantStatus, { each: true })
  @IsOptional()
  approval_statuses?: ApplicantStatus[];

  @IsEnum(PromotionStatus, { each: true })
  @IsOptional()
  promotion_statuses?: PromotionStatus[];

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  apply_start_at?: string; //申請時間

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  apply_end_at?: string;
}
