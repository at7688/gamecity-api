import { Type } from 'class-transformer';
import { IsJSON, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class Every8dConfig {
  @IsString()
  @IsNotEmpty()
  UID: string;

  @IsString()
  @IsNotEmpty()
  PWD: string;
}
export class CreateSmsMerchantDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Every8dConfig)
  @IsNotEmpty()
  config: Every8dConfig;
}
