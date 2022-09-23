import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SetGameWaterDto } from './set-game-water.dto';

export class CreateVipDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  icon: string;

  @IsInt()
  @IsNotEmpty()
  valid_bet: number;

  @IsInt()
  @IsNotEmpty()
  deposite_min: number;

  @IsInt()
  @IsNotEmpty()
  withdraw_min: number;

  @IsInt()
  @IsNotEmpty()
  withdraw_max: number;

  @IsInt()
  @IsNotEmpty()
  card_rotate_id: number;

  @IsInt()
  @IsNotEmpty()
  payment_rotate_id: number;
}
