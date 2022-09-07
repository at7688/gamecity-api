import { IsEnum, IsOptional } from 'class-validator';
import { LangType } from 'src/enums';
import { PageContentCode } from '../enums';

export class SearchPageContentsDto {
  @IsEnum(PageContentCode)
  @IsOptional()
  code?: PageContentCode;

  @IsEnum(LangType)
  @IsOptional()
  lang?: LangType;
}
