import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  platform_code: string;
}
