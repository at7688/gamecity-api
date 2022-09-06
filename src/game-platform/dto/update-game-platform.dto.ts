import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { GamePlatformStatus } from '../enums';

export class UpdateGamePlatformDto {
  @IsEnum(GamePlatformStatus)
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  status: GamePlatformStatus;
}
