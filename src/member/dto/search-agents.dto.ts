import { MemberType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchAgentsDto extends PaginateDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  parent_id: string;

  @Transform(({ value }) => !!value)
  @IsBoolean()
  @IsOptional()
  all: boolean;
}
