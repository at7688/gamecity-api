import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';
import { TransferType } from '../enums';

export class SearchTransfersDto extends PaginateDto {
  @IsEnum(TransferType)
  @IsNotEmpty()
  type: TransferType;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsNumber()
  @IsOptional()
  amount_start?: number;

  @IsNumber()
  @IsOptional()
  amount_end?: number;
}
