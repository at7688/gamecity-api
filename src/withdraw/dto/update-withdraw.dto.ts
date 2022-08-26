import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { WithdrawStatus } from 'src/withdraw/enums';

export class UpdateWithdrawDto {
  @IsEnum(WithdrawStatus)
  @IsOptional()
  status?: WithdrawStatus;

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;

  @IsNumber()
  @IsOptional()
  withdraw_fee?: number;
}
