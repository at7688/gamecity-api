import { IsEnum, IsOptional } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';
import { AnnouncementType } from '../enums';

export class ClientSearchAnnouncementsDto extends PaginateDto {
  @IsEnum(AnnouncementType)
  @IsOptional()
  type?: AnnouncementType;
}
