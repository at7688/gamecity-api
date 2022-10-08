import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VipService } from './vip.service';
import { CreateVipDto } from './dto/create-vip.dto';
import { UpdateVipDto } from './dto/update-vip.dto';
import { SetGameWaterDto } from './dto/set-game-water.dto';
import { endOfMonth, startOfMonth, subDays } from 'date-fns';
import { CheckVipDto } from './dto/check-vip.dto';

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

  @Post('water')
  gameWater(@Body() setGameWaterDto: SetGameWaterDto) {
    return this.vipService.gameWater(setGameWaterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vipService.remove(id);
  }

  @Get('queue')
  getVipQueue() {
    return this.vipService.getVipQueue();
  }
}
