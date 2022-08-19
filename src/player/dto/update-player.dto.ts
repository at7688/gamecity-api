import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePlayerDto {
  @IsString()
  @IsNotEmpty()
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
