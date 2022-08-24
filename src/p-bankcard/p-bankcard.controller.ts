import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UploadsService } from 'src/uploads/uploads.service';
import { UpdatePBankcardDto } from './dto/update-p-bankcard.dto';
import { PBankcardService } from './p-bankcard.service';

@Controller('p-bankcards')
export class PBankcardController {
  constructor(
    private readonly pBankcardService: PBankcardService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Get()
  findAll() {
    return this.pBankcardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pBankcardService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePBankcardDto: UpdatePBankcardDto,
  ) {
    return this.pBankcardService.update(id, updatePBankcardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pBankcardService.remove(id);
  }
}
