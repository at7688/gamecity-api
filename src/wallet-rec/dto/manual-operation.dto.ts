import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { WalletTargetType } from '../enums';

export class ManualOperationDto {
  @IsEnum(WalletTargetType)
  @IsNotEmpty()
  target_type?: WalletTargetType;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  note?: string;
}
