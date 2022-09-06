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
import { IdentityService } from './identity.service';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { Platforms } from 'src/metas/platforms.meta';
import { PlatformType, Player } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageType } from 'src/uploads/enums';
import { UploadsService } from 'src/uploads/uploads.service';
import { User } from 'src/decorators/user.decorator';

@Controller('identities')
export class IdentityController {
  constructor(
    private readonly identityService: IdentityService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 1024 * 1024 } }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFile(file, ImageType.IDENTITY);
  }

  @Post()
  @Platforms([PlatformType.PLAYER])
  create(@Body() data: CreateIdentityDto, @User() player: Player) {
    return this.identityService.create(data, player);
  }

  @Get()
  findAll() {
    return this.identityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.identityService.findOne(id);
  }

  @Patch(':id')
  @Platforms([PlatformType.PLAYER])
  update(
    @Param('id') id: string,
    @Body() updateIdentityDto: UpdateIdentityDto,
    @User() player: Player,
  ) {
    return this.identityService.update(id, updateIdentityDto, player);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.identityService.remove(id);
  }
}
