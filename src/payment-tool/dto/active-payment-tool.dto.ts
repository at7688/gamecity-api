import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ActivePaymentToolDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;
}
