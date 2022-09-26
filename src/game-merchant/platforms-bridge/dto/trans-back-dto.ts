import { IsOptional, IsString } from 'class-validator';

export class TransBackDto {
  @IsString()
  @IsOptional()
  platform_code?: string;
}
