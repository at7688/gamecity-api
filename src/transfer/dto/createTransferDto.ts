import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { TransferType } from '../enums';
export class CreateTransferDto {
  @IsNotEmpty()
  @IsEnum(TransferType)
  type: TransferType;

  @ValidateIf((t) => t.type === TransferType.PLAYER)
  @IsNotEmpty()
  target_player_id?: string;

  @ValidateIf((t) => t.type === TransferType.AGENT)
  @IsNotEmpty()
  target_agent_id?: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsInt()
  @IsOptional()
  rolling_demand = 1; // 洗碼倍數

  @IsString()
  @IsOptional()
  inner_note?: string;

  @IsString()
  @IsOptional()
  outter_note?: string;
}
