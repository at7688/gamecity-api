import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
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
