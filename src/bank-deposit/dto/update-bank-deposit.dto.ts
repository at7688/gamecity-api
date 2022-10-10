import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProcessStatus } from 'src/enums';

export class UpdateBankDepositDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(ProcessStatus)
  @IsOptional()
  status?: ProcessStatus;

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;
}
