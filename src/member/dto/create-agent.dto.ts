import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAgentDto {
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
  @IsOptional()
  promo_code?: string;

  @IsString()
  @IsOptional()
  parent_id?: string;

  @IsNumber()
  @IsNotEmpty()
  fee_duty: number;

  @IsNumber()
  @IsNotEmpty()
  promotion_duty: number;
}
