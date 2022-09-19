import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class GameDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  category_code: string;
}
export class CreateGamesDto {
  @IsString()
  @IsNotEmpty()
  platform_code: string;
  @ValidateNested({ each: true })
  @Type(() => GameDto)
  games: GameDto[];
}
