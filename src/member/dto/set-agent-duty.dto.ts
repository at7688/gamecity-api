import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SetAgentDutyDto {
  @IsNumber()
  @IsNotEmpty()
  fee_duty: number;

  @IsNumber()
  @IsNotEmpty()
  promotion_duty: number;
}
