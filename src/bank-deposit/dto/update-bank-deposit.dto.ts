import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DepositStatus } from 'src/enums';

export class UpdateBankDepositDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(DepositStatus)
  @IsOptional()
  status?: DepositStatus;

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;
}
