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
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { ResCode } from 'src/errors/enums';
import { Serilizer } from 'src/interceptors/serializer.interceptor';
import { Platforms } from 'src/metas/platforms.meta';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImageType } from 'src/uploads/enums';
import { UploadsService } from 'src/uploads/uploads.service';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { IdentityClientDto } from './dto/identity.client.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { IdentityClientService } from './identity.client.service';

@Controller('id-verify')
@Platforms([PlatformType.PLAYER])
@Serilizer(IdentityClientDto)
export class IdentityClientController {
  constructor(
    private readonly identityService: IdentityClientService,
    private readonly uploadsService: UploadsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 1024 * 1024 } }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      this.prisma.error(ResCode.EMPTY_VAL, '檔案不可為空');
    }
    const result = await this.uploadsService.uploadFile(
      file,
      ImageType.IDENTITY,
    );
    return this.prisma.success(result);
  }

  @Post()
  create(@Body() data: CreateIdentityDto) {
    return this.identityService.create(data);
  }

  @Get()
  findOne() {
    return this.identityService.findOne();
  }
}
