import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBankDepositRecDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  // acc_tail?: string;
  // note?: string;

  @IsString()
  @IsNotEmpty()
  card_id: string;

  @IsString()
  @IsNotEmpty()
  player_id: string;
}
