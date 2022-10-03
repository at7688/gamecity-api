import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LogoutGameDto {
  @IsString()
  @IsNotEmpty()
  platform_code: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}
