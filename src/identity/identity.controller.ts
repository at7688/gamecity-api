import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { AdminUser } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { UploadsService } from 'src/uploads/uploads.service';
import { SearchIdentitiesDto } from './dto/search-identities.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { IdentityService } from './identity.service';

@Controller('identities')
export class IdentityController {
  constructor(
    private readonly identityService: IdentityService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Get()
  findAll(@Query() query: SearchIdentitiesDto) {
    return this.identityService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.identityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIdentityDto: UpdateIdentityDto,
    @User() user: AdminUser,
  ) {
    return this.identityService.update(id, updateIdentityDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.identityService.remove(id);
  }
}
