import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';
import { ValidateStatus } from 'src/enums';

export class SearchIdentitiesDto extends PaginateDto {
  @IsEnum(ValidateStatus)
  @IsOptional()
  @Transform(({ value }) => +value)
  status?: ValidateStatus;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  username?: string;
}
