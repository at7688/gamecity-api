import { AnnouncementType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchAnnouncementsDto extends PaginateDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsEnum(AnnouncementType)
  @IsOptional()
  type = null;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => +value)
  is_active?: number = 0;
}
