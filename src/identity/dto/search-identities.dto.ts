import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';
import { IdentityVarifyStatus } from '../enums';

export class SearchIdentitiesDto extends PaginateDto {
  @IsEnum(IdentityVarifyStatus)
  @IsOptional()
  @Transform(({ value }) => +value)
  status?: IdentityVarifyStatus;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  username?: string;
}
