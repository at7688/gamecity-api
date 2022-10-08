import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class SetVipScheduleDto {
  @IsString()
  @IsNotEmpty()
  type: 'week' | 'month';

  @IsInt()
  @IsNotEmpty()
  @ValidateIf((t) => t.type === 'week')
  day: number;

  @IsInt()
  @IsNotEmpty()
  @ValidateIf((t) => t.type === 'month')
  date: number;

  @IsInt()
  @IsNotEmpty()
  hour: number;

  @IsInt()
  @IsNotEmpty()
  minute: number;
}
