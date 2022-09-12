import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GameRatioService } from './game-ratio.service';
import { CreateGameRatioDto } from './dto/create-game-ratio.dto';
import { UpdateGameRatioDto } from './dto/update-game-ratio.dto';
import { Public } from 'src/metas/public.meta';

@Controller('game-ratio')
@Public()
export class GameRatioController {
  constructor(private readonly gameRatioService: GameRatioService) {}

  @Post('create')
  create(@Body() createGameRatioDto: CreateGameRatioDto) {
    return this.gameRatioService.create(createGameRatioDto);
  }

  @Get()
  findAll() {
    return this.gameRatioService.findAll();
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
