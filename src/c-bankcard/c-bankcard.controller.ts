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
import { CBankcardService } from './c-bankcard.service';
import { CreateCBankcardDto } from './dto/create-c-bankcard.dto';
import { SearchCBankcardDto } from './dto/search-c-bankcard.dto';
import { UpdateCBankcardDto } from './dto/update-c-bankcard.dto';

@Controller('bankcard')
export class CBankcardController {
  constructor(private readonly cBankcardService: CBankcardService) {}

  @Post('create')
  create(@Body() createCBankcardDto: CreateCBankcardDto) {
    return this.cBankcardService.create(createCBankcardDto);
  }

  @Post('list')
  findAll(@Body() search: SearchCBankcardDto) {
    return this.cBankcardService.findAll(search);
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

  @Post('clean/:id')
  clean(@Param('id') id: string) {
    return this.cBankcardService.clean(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cBankcardService.remove(id);
  }
}
