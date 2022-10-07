import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePlayerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: '暱稱需為3個以上英數字' })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  line_id?: string;

  @IsString()
  @IsOptional()
  telegram?: string;
}
