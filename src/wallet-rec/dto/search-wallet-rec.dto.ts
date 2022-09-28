import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';
import { TargetType } from 'src/enums';
import { WalletRecType } from '../enums';

export class SearchWalletRecDto extends PaginateDto {
  @IsEnum(TargetType, { each: true })
  @IsOptional()
  target_types: TargetType[];

  @IsEnum(WalletRecType, { each: true })
  @IsOptional()
  types?: WalletRecType[];

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

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at?: string;
}
