import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
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

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  send_start_at?: string; // 發送時間

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  send_end_at?: string;

  @IsEnum(ApprovalType)
  @IsOptional()
  approval_type?: ApprovalType;

  @IsEnum(SettlementType)
  @IsOptional()
  settlement_type?: SettlementType;
}
