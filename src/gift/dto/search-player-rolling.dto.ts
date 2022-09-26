import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchPlayerRollingDto extends PaginateDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  recieve_start_at?: string; // 領取時間

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  recieve_end_at?: string;
}
