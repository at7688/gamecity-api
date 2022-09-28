import { IsOptional, IsString } from 'class-validator';

export class GetBalanceDto {
  @IsString()
  @IsOptional()
  platform_code?: string;
}
