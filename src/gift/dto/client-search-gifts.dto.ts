import { IsIn, IsOptional } from 'class-validator';
import { GiftStatus } from '../enums';

export class ClientSearchGiftsDto {
  @IsIn([GiftStatus.SENT, GiftStatus.RECIEVED])
  @IsOptional()
  status: number;
}
