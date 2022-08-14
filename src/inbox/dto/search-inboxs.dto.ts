import { InboxSendType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchInboxsDto extends PaginateDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsEnum(InboxSendType)
  @IsOptional()
  send_type: InboxSendType;

  @IsIn([1, 2]) // 1 寄信, 2 收信
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  type: number;

  @IsIn([0, 1, 2]) // 0 全部, 1: 已讀取, 2: 未讀取
  @IsOptional()
  @Transform(({ value }) => +value)
  is_read: number;
}
