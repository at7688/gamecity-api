import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CBankcardService } from './c-bankcard.service';
import { CreateCBankcardDto } from './dto/create-c-bankcard.dto';
import { UpdateCBankcardDto } from './dto/update-c-bankcard.dto';

@Controller('c-bankcards')
export class CBankcardController {
  constructor(private readonly cBankcardService: CBankcardService) {}

  @Post()
  create(@Body() createCBankcardDto: CreateCBankcardDto) {
    return this.cBankcardService.create(createCBankcardDto);
  }

  @Get()
  findAll() {
    return this.cBankcardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cBankcardService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCBankcardDto: UpdateCBankcardDto,
  ) {
    return this.cBankcardService.update(id, updateCBankcardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cBankcardService.remove(id);
  }
}
