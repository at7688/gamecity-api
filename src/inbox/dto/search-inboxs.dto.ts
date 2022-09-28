import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';
import { TargetType } from 'src/enums';
import { InboxViewType, ReadStatus } from '../enums';

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

  @IsEnum(TargetType)
  @IsOptional()
  @Transform(({ value }) => +value)
  target_type?: TargetType;

  @IsEnum(InboxViewType) // 1 寄信, 2 收信
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  view_type: InboxViewType;

  @IsEnum(ReadStatus) // 0 全部, 1: 已讀取, 2: 未讀取
  @IsOptional()
  @Transform(({ value }) => +value)
  is_read: ReadStatus;
}
