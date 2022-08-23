import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PBankcardService } from './p-bankcard.service';
import { CreatePBankcardDto } from './dto/create-p-bankcard.dto';
import { UpdatePBankcardDto } from './dto/update-p-bankcard.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from 'src/uploads/uploads.service';
import { ImageType } from 'src/uploads/enums';
import { User } from 'src/decorators/user.decorator';
import { LoginUser } from 'src/types';
import { PlatformType, Player } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';

@Controller('p-bankcards')
export class PBankcardController {
  constructor(
    private readonly pBankcardService: PBankcardService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('upload')
  @Platforms([PlatformType.PLAYER])
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 1024 * 200 } }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFile(file, ImageType.PLAYER_CARD);
  }

  @Post()
  @Platforms([PlatformType.PLAYER])
  create(@Body() data: CreatePBankcardDto, @User() player: Player) {
    return this.pBankcardService.create(data, player);
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
