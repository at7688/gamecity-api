import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterPlayerDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\w{5,}$/, { message: '帳號需為5個以上英數字' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\w{5,}$/, { message: '密碼需為5個以上英數字' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: '暱稱需為3個以上英數字' })
  nickname: string;

  @IsString()
  @IsOptional()
  invited_code: string;

  @IsString()
  @IsNotEmpty()
  phone_code: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  line_id?: string;
}
