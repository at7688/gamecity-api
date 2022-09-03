import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchPaymentToolsDto extends PaginateDto {
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => +value)
  is_active?: number = 0;

  @IsOptional()
  @IsString()
  merchant_id?: string;

  @IsOptional()
  @IsString()
  tool_name?: string;

  @IsOptional()
  @IsString()
  merchant_no?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => +value)
  rotation_id: number;
}
