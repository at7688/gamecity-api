import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SetAgentDutyDto {
  @IsString()
  @IsNotEmpty()
  agent_id: string;

  @IsNumber()
  @IsNotEmpty()
  fee_duty: number;

  @IsNumber()
  @IsNotEmpty()
  promotion_duty: number;
}
