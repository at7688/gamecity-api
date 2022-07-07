import { MemberType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchMembersDto extends PaginateDto {
  @IsEnum(MemberType)
  @IsOptional()
  type: MemberType;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  parent_id: string;
}
