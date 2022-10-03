import { IsJSON, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class GetSmsCreditDto {
  @IsString()
  @IsNotEmpty()
  merchant_code: string;
}
