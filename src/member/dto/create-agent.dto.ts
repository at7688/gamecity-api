import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\w{5,}$/, { message: '帳號需為5個以上英數字' })
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  promo_code?: string;

  @IsString()
  @IsOptional()
  parent_id?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
