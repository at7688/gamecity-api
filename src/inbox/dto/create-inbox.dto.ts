import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { InboxTargetType } from '../enums';

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

  @IsEnum(InboxTargetType)
  @IsNotEmpty()
  target_type: InboxTargetType; // 1: 代理, 2: 玩家
}
