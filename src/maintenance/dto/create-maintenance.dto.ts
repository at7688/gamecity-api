import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { MaintenanceType } from '../enums';

export class CreateMaintenanceDto {
  @IsBoolean()
  @IsNotEmpty()
  is_repeat: boolean;

  @IsEnum(MaintenanceType)
  @IsNotEmpty()
  type: MaintenanceType;

  @ValidateIf((t) => t.type === MaintenanceType.GAME_PLATFORM)
  @IsString()
  @IsNotEmpty()
  platform_code: string;

  @ValidateIf((t) => t.type === MaintenanceType.GAME)
  @IsString()
  @IsNotEmpty()
  game_id: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at?: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at?: Date;

  @ValidateIf((t) => t.is_repeat)
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  repeat_start_at?: Date;

  @ValidateIf((t) => t.is_repeat)
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  repeat_end_at?: Date;
}
