import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RotationService } from './rotation.service';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';

@Controller('rotation')
export class RotationController {
  constructor(private readonly rotationService: RotationService) {}

  @Post('create')
  create(@Body() createRotationDto: CreateRotationDto) {
    return this.rotationService.create(createRotationDto);
  }

  @Get('list')
  findAll(@Query('type', ParseIntPipe) type: number) {
    return this.rotationService.findAll(type);
  }

  @Get('options/:type')
  options(@Param('type', ParseIntPipe) type: number) {
    return this.rotationService.options(type);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRotationDto: UpdateRotationDto,
  ) {
    return this.rotationService.update(+id, updateRotationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rotationService.remove(+id);
  }
}
