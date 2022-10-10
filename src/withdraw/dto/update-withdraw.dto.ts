import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProcessStatus } from 'src/enums';

export class UpdateWithdrawDto {
  @IsEnum(ProcessStatus)
  @IsOptional()
  status?: ProcessStatus;

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;

  @IsNumber()
  @IsOptional()
  fee?: number;
}
