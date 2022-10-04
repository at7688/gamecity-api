import { IsNotEmpty, IsString } from 'class-validator';

export class SetSmsTemplateDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
