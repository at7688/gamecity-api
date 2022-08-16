import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchPlayersDto extends PaginateDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(',').map((s) => s.trim()))
  vips: string[];

  @IsIn([0, 1, 2])
  @IsOptional()
  @Transform(({ value }) => +value)
  is_block?: number;

  @IsOptional()
  @IsString()
  inviter_id: string;

  @Transform(({ value }) => !!value)
  @IsBoolean()
  @IsOptional()
  all: boolean;
}
