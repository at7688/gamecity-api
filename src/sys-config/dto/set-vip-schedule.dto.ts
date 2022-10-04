import { IsNotEmpty, IsString } from 'class-validator';

export class SetVipScheduleDto {
  @IsString()
  @IsNotEmpty()
  cron: string;
}
