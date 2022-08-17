import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PBankcardService } from './p-bankcard.service';
import { CreatePBankcardDto } from './dto/create-p-bankcard.dto';
import { UpdatePBankcardDto } from './dto/update-p-bankcard.dto';

@Controller('p-bankcards')
export class PBankcardController {
  constructor(private readonly pBankcardService: PBankcardService) {}

  @Post()
  create(@Body() createPBankcardDto: CreatePBankcardDto) {
    return this.pBankcardService.create(createPBankcardDto);
  }

  @Get()
  findAll() {
    return this.pBankcardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pBankcardService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePBankcardDto: UpdatePBankcardDto,
  ) {
    return this.pBankcardService.update(+id, updatePBankcardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pBankcardService.remove(+id);
  }
}
