import { PartialType } from '@nestjs/swagger';
import { CreateGameRatioDto } from './create-game-ratio.dto';

export class UpdateGameRatioDto extends PartialType(CreateGameRatioDto) {}
