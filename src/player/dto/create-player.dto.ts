import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreatePlayerDto {
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
  agent_id: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;
}
