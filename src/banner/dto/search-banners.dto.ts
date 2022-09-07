import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';
import { LangType, WebPlatform } from 'src/enums';

export class SearchBannersDto extends PaginateDto {
  @IsEnum(LangType)
  @IsOptional()
  lang?: LangType;

  @IsEnum(WebPlatform)
  @IsOptional()
  @Transform(({ value }) => +value)
  platform?: WebPlatform;

  @IsOptional()
  @IsString()
  title?: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => +value)
  is_active?: number = 0;
}
