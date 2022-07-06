import { AnnouncementType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class ClientSearchAnnouncementsDto extends PaginateDto {
  @IsEnum(AnnouncementType)
  @IsOptional()
  type = null;
}
