import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlatformType } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImageType } from 'src/uploads/enums';
import { UploadsService } from 'src/uploads/uploads.service';
import { CreatePBankcardDto } from './dto/create-p-bankcard.dto';
import { UpdatePBankcardDto } from './dto/update-p-bankcard.dto';
import { PBankcardClientService } from './p-bankcard.client.service';

@Controller('client/bankcard')
@Platforms([PlatformType.PLAYER])
export class PBankcardClientController {
  constructor(
    private readonly pBankcardService: PBankcardClientService,
    private readonly uploadsService: UploadsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 1024 * 1024 } }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadsService.uploadFile(
      file,
      ImageType.PLAYER_CARD,
    );
    return this.prisma.success(result);
  }

  @Post('create')
  async create(@Body() data: CreatePBankcardDto) {
    await this.pBankcardService.create(data);
    return this.prisma.success();
  }

  @Patch('default/:id')
  default(@Param('id') id: string) {
    return this.pBankcardService.default(id);
  }

  @Post('list')
  findAll() {
    return this.pBankcardService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePBankcardDto: UpdatePBankcardDto,
  ) {
    return this.pBankcardService.update(id, updatePBankcardDto);
  }
}
