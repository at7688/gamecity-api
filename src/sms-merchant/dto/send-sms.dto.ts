import { IsJSON, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SendSmsDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString({ each: true })
  @IsNotEmpty()
  phones: string[];
}
