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
  @Transform(({ value }) => {
    return value.map(Number);
  })
  layers?: number[];

  @IsIn([0, 1, 2])
  @IsOptional()
  @Transform(({ value }) => +value)
  is_block?: number;

  @IsOptional()
  @IsString()
  parent_id: string;

  @Transform(({ value }) => !!value)
  @IsBoolean()
  @IsOptional()
  all: boolean;
}
