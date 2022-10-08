import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CheckVipDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at?: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at?: Date;
}
