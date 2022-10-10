import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\w{5,}$/, { message: '帳號需為5個以上英數字' })
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
  @Matches(/^\w{5,}$/, { message: '密碼需為5個以上英數字' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: '暱稱需為3個以上英數字' })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  agent_id: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;
}
