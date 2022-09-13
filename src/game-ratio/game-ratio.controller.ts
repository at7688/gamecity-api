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

@Controller('game-ratio')
export class GameRatioController {
  constructor(private readonly gameRatioService: GameRatioService) {}

  @Post('batchSet')
  batchSet(@Body() batchSetGameRatiosDto: BatchSetGameRatioDtos) {
    return this.gameRatioService.batchSet(batchSetGameRatiosDto);
  }
  @Post('set')
  set(@Body() createGameRatioDto: CreateGameRatioDto) {
    return this.gameRatioService.set(createGameRatioDto);
  }

  @Get('list/:agent_id')
  findAllByPlayer(
    @Param('agent_id') agent_id: string,
    @Query() query: SearchGameRatiosDto,
  ) {
    return this.gameRatioService.findAllByPlayer(agent_id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameRatioService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGameRatioDto: UpdateGameRatioDto,
  ) {
    return this.gameRatioService.update(+id, updateGameRatioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameRatioService.remove(+id);
  }
}
