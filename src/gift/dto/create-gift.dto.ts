import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGiftDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  nums_rolling: number;
}
