import { InboxSendType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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
}
