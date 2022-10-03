import { IsJSON, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class GetPhoneCodeDto {
  @IsString()
  @IsNotEmpty()
  phone: string;
}
