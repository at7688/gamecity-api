import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class GameWater {
  @IsString()
  @IsNotEmpty()
  platform_code: string;

  @IsString()
  @IsNotEmpty()
  game_code: string;

  @IsNumber()
  @IsNotEmpty()
  water: number;
}

export class SetGameWaterDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateNested({ each: true })
  @Type(() => GameWater)
  @IsNotEmpty()
  setting: GameWater[];
}
