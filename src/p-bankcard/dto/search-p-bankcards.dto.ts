import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';
import { ValidStatus } from '../enums';

export class SearchPBankcardsDto extends PaginateDto {
  @IsEnum(ValidStatus, { each: true })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value?.split(',').map(Number) : value,
  )
  valid_status: ValidStatus[];

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  account?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  withdraw_start_at?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  withdraw_end_at?: string;
}
