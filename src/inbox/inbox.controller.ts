import { SearchInboxsDto } from './dto/search-announcements.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { InboxService } from './inbox.service';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { UpdateInboxDto } from './dto/update-inbox.dto';
import { Serilizer } from 'src/interceptors/serializer.interceptor';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/decorators/user.decorator';
import { AdminUser, Member } from '@prisma/client';
import { LoginUser } from 'src/types';

@Controller('inboxs')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Post()
  create(@Body() createInboxDto: CreateInboxDto, @User() user: LoginUser) {
    return this.inboxService.create(createInboxDto, user);
  }

  @Get()
  findAll(@Query() query: SearchInboxsDto, @Request() req) {
    return this.inboxService.findAll(query, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inboxService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInboxDto: UpdateInboxDto) {
    return this.inboxService.update(+id, updateInboxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inboxService.remove(+id);
  }
}
