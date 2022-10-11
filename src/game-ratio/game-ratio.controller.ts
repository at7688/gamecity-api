import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GameRatioService } from './game-ratio.service';
import { CreateGameRatioDto } from './dto/create-game-ratio.dto';
import { UpdateGameRatioDto } from './dto/update-game-ratio.dto';
import { Public } from 'src/metas/public.meta';
import { SearchGameRatiosDto } from './dto/search-game-ratios.dto';
import { BatchSetGameRatioDtos } from './dto/batch-set-game-ratios.dto';
import { Platforms } from 'src/metas/platforms.meta';
import { PlatformType } from '@prisma/client';

@Controller('gameRatio')
@Platforms([PlatformType.PLAYER])
export class GameRatioController {
  constructor(private readonly gameRatioService: GameRatioService) {}

  @Post('batchSet')
  batchSet(@Body() batchSetGameRatiosDto: BatchSetGameRatioDtos) {
    return this.gameRatioService.batchSet(batchSetGameRatiosDto);
  }

  @Post('set')
  set(@Body() createGameRatioDto: CreateGameRatioDto) {
    return this.gameRatioService.set(createGameRatioDto, false);
  }

  @Post('list')
  findAll(@Body() search: SearchGameRatiosDto) {
    return this.gameRatioService.findAll(search);
  }
}
