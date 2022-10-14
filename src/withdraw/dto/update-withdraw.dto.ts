import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProcessStatus } from 'src/enums';

export class UpdateWithdrawDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(ProcessStatus)
  @IsNotEmpty()
  status: ProcessStatus;

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;

  @IsNumber()
  @IsNotEmpty()
  fee: number;
}
