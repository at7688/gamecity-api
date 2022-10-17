import { SearchPromotionWaterDto } from './dto/search-promotion-water.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PlatformType } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionService } from './promotion.service';
import { SetGameWaterDto } from './dto/set-game-water.dto';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('create')
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionService.create(createPromotionDto);
  }

  @Post('list')
  findAll() {
    return this.promotionService.findAll();
  }

  @Get('view/:id')
  findOne(@Param('id') id: string) {
    return this.promotionService.findOne(id);
  }

  @Post('getWaters')
  getWaters(@Body() search: SearchPromotionWaterDto) {
    return this.promotionService.getWaters(search);
  }
  @Post('setWaters')
  setWaters(@Body() setGameWaterDto: SetGameWaterDto) {
    return this.promotionService.setWaters(setGameWaterDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionService.remove(id);
  }

  @Get('queue')
  @Platforms([PlatformType.PLAYER])
  getQueue() {
    return this.promotionService.getQueue();
  }
}
