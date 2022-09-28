import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TargetType } from 'src/enums';

export class ManualOperationDto {
  @IsEnum(TargetType)
  @IsNotEmpty()
  target_type?: TargetType;

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
