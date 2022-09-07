import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LangType } from 'src/enums';
import { PageContentCode } from '../enums';

export class SearchPageContentClientDto {
  @IsEnum(PageContentCode)
  @IsNotEmpty()
  code: PageContentCode;

  @IsEnum(LangType)
  @IsNotEmpty()
  lang: LangType;
}
