import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ActivePaymentToolDto {
  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;
}
