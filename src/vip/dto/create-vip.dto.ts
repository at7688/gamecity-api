import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVipDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsNumber()
  @IsNotEmpty()
  ebet_min: number;

  @IsNumber()
  @IsNotEmpty()
  deposite_min: number;

  @IsNumber()
  @IsNotEmpty()
  withdraw_min: number;

  @IsNumber()
  @IsNotEmpty()
  withdraw_max: number;
}
