import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginateDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => +value)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => +value)
  perpage?: number = 100;
}
