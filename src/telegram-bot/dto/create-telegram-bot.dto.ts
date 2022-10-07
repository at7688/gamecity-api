import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TelegramBotType } from '../enums';

export class CreateTelegramBotDto {
  @IsString()
  @IsNotEmpty()
  chat_id: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEnum(TelegramBotType)
  @IsNotEmpty()
  type: TelegramBotType;
}
