import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchAgentsDto extends PaginateDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsInt({ each: true })
  @IsOptional()
  layers?: number[];

  @IsIn([0, 1, 2])
  @IsOptional()
  is_blocked?: number;

  @IsOptional()
  @IsString()
  parent_id: string;

  @IsBoolean()
  @IsOptional()
  all: boolean;
}
