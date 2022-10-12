import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class GameSetting {
  @IsString()
  @IsNotEmpty()
  platform_code: string;

  @IsString()
  @IsNotEmpty()
  game_code: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  ratio: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1)
  water: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  water_duty: number;
}

export class BatchSetGameRatioDtos {
  @IsString()
  @IsNotEmpty()
  agent_id: string;

  @ValidateNested({ each: true })
  @Type(() => GameSetting)
  @IsNotEmpty()
  @ArrayNotEmpty()
  setting: GameSetting[];
}
