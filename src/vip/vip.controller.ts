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

@Controller('vips')
export class VipController {
  constructor(private readonly vipService: VipService) {}

  @Post()
  create(@Body() createVipDto: CreateVipDto) {
    return this.vipService.create(createVipDto);
  }

  @Get()
  findAll() {
    return this.vipService.findAll();
  }

  @Get('options')
  options() {
    return this.vipService.options();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vipService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVipDto: UpdateVipDto) {
    return this.vipService.update(id, updateVipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vipService.remove(id);
  }
}
