import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RotateType } from '../enums';

export class CreateRotationDto {
  @IsInt()
  @IsOptional()
  sort = 0;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsEnum(RotateType)
  @IsNotEmpty()
  type: RotateType;
}
