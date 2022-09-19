import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class GameSetting {
  @IsString()
  @IsNotEmpty()
  game_code: string;

  @IsNumber()
  @IsNotEmpty()
  ratio: number;

  @IsNumber()
  @IsNotEmpty()
  water: number;

  @IsNumber()
  @IsNotEmpty()
  water_duty: number;
}

export class BatchSetGameRatioDtos {
  @IsString()
  @IsNotEmpty()
  platform_code: string;

  @IsString()
  @IsNotEmpty()
  agent_id: string;

  @ValidateNested({ each: true })
  @Type(() => GameSetting)
  ratios: GameSetting[];
}
