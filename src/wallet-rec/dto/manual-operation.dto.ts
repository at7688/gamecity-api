import { ManualType } from './../enums';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { WalletRecType, WalletTargetType } from '../enums';

export class ManualOperationDto {
  @IsEnum(WalletTargetType)
  @IsNotEmpty()
  target_type?: WalletTargetType;

  @IsEnum(ManualType)
  @IsNotEmpty()
  type: ManualType;

  @IsString()
  @ValidateIf((t) => t.target_type === WalletTargetType.PLAYER)
  player_id?: string;

  @IsString()
  @ValidateIf((t) => t.target_type === WalletTargetType.AGENT)
  agent_id?: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsOptional()
  @IsInt()
  rolling_amount?: number;
}
