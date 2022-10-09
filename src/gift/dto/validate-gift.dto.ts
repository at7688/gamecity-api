import { IsEnum, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { GiftStatus } from '../enums';

export class ValidateGiftDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsIn([GiftStatus.SENT, GiftStatus.ABANDONED])
  @IsNotEmpty()
  status: GiftStatus;
}
