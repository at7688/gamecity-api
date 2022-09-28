import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TargetType } from 'src/enums';

export class CreateInboxDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEnum(TargetType)
  @IsNotEmpty()
  target_type: TargetType; // 1: 代理, 2: 玩家
}
