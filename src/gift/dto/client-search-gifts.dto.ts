import { IsIn, IsOptional } from 'class-validator';
import { SendStatus } from '../enums';

export class ClientSearchGiftsDto {
  @IsIn([SendStatus.SENT, SendStatus.RECIEVED])
  @IsOptional()
  status: number;
}
