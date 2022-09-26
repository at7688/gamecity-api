import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginGameDto {
  @IsString()
  @IsNotEmpty()
  platform_code: string;

  @IsString()
  @IsOptional()
  game_code?: string;
}
