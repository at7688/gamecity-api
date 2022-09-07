import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { LangType, WebPlatform } from 'src/enums';

export class SearchBannersClientDto {
  @IsEnum(LangType)
  @IsNotEmpty()
  lang: LangType;

  @IsEnum(WebPlatform)
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  platform: WebPlatform;
}
