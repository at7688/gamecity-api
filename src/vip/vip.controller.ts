import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CheckVipDto } from './dto/check-vip.dto';
import { CreateVipDto } from './dto/create-vip.dto';
import { SearchVipQueueDto } from './dto/search-vip-queue.dto';
import { SearchVipWaterDto } from './dto/search-vip-water.dto';
import { SetGameWaterDto } from './dto/set-game-water.dto';
import { UpdateVipDto } from './dto/update-vip.dto';
import { VipService } from './vip.service';

@Controller('vip')
export class VipController {
  constructor(private readonly vipService: VipService) {}

  @Post('create')
  create(@Body() createVipDto: CreateVipDto) {
    return this.vipService.create(createVipDto);
  }

  @Get('list')
  findAll() {
    return this.vipService.findAll();
  }

  @Post('check')
  conditionCheck(@Body() data: CheckVipDto) {
    const { start_at, end_at } = data;
    return this.vipService.conditionCheck(start_at, end_at);
  }

  @Post('apply')
  checkAndApply(@Body() data: CheckVipDto) {
    const { start_at, end_at } = data;
    return this.vipService.checkAndApply(start_at, end_at);
  }

  @Get('options')
  options() {
    return this.vipService.options();
  }

  @Get('view/:id')
  findOne(@Param('id') id: string) {
    return this.vipService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVipDto: UpdateVipDto) {
    return this.vipService.update(id, updateVipDto);
  }

  @Post('getWaters')
  getWaters(@Body() search: SearchVipWaterDto) {
    return this.vipService.getWaters(search);
  }
  @Post('setWaters')
  setWaters(@Body() setGameWaterDto: SetGameWaterDto) {
    return this.vipService.setWaters(setGameWaterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vipService.remove(id);
  }

  @Post('queue')
  getVipQueue(@Body() data: SearchVipQueueDto) {
    return this.vipService.getVipQueue(data);
  }
}
