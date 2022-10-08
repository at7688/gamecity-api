import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';
import { ValidateStatus } from 'src/enums';

export class SearchPBankcardsDto extends PaginateDto {
  @IsEnum(ValidateStatus, { each: true })
  @IsOptional()
  valid_status: ValidateStatus[];

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
