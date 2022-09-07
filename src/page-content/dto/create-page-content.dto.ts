import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LangType } from 'src/enums';
import { PageContentCode } from '../enums';

export class CreatePageContentDto {
  @IsEnum(PageContentCode)
  @IsNotEmpty()
  code: PageContentCode;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(LangType)
  @IsNotEmpty()
  lang: LangType;
}
