import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApprovalType, SettlementType } from 'src/promotion/enums';

export class SearchGiftsDto {
  @IsString()
  @IsOptional()
  promotion_id?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString({ each: true })
  @IsOptional()
  vip_ids?: string[];

  @IsEnum(ApprovalType)
  @IsOptional()
  apply_approval_type?: ApprovalType;

  @IsEnum(ApprovalType)
  @IsOptional()
  pay_approval_type?: ApprovalType;

  @IsEnum(SettlementType)
  @IsOptional()
  settlement_type?: SettlementType;
}
