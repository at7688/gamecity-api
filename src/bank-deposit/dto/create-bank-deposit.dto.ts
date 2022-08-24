import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBankDepositDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  player_card_id: string;

  // @IsString()
  // @IsNotEmpty()
  // player_id: string;
}
