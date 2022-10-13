import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CurrentPaymentToolDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  is_current: boolean;
}
