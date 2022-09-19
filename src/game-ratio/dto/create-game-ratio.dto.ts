import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGameRatioDto {
  @IsString()
  @IsNotEmpty()
  platform_code: string;

  @IsString()
  @IsNotEmpty()
  game_code: string;

  @IsString()
  @IsNotEmpty()
  agent_id: string;

  @IsNumber()
  @IsNotEmpty()
  ratio: number;

  @IsNumber()
  @IsNotEmpty()
  water: number;

  @IsNumber()
  @IsNotEmpty()
  water_duty: number;
}
