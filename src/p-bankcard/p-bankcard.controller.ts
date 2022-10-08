import { ValidatePBankcardDto } from './dto/validate-p-bankcard.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageType } from 'src/uploads/enums';
import { UploadsService } from 'src/uploads/uploads.service';
import { SearchPBankcardsDto } from './dto/search-p-bankcards.dto';
import { UpdatePBankcardDto } from './dto/update-p-bankcard.dto';
import { PBankcardService } from './p-bankcard.service';

@Controller('playerCard')
export class PBankcardController {
  constructor(
    private readonly pBankcardService: PBankcardService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 1024 * 1024 } }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFile(file, ImageType.PLAYER_CARD);
  }

  @Post('list')
  findAll(@Body() search: SearchPBankcardsDto) {
    return this.pBankcardService.findAll(search);
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
  @Post('validate')
  validate(@Body() validatePBankcardDto: ValidatePBankcardDto) {
    return this.pBankcardService.validate(validatePBankcardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pBankcardService.remove(id);
  }
}
