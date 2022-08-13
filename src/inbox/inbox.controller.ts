import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { LoginUser } from 'src/types';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { SearchInboxsDto } from './dto/search-inboxs.dto';
import { UpdateInboxDto } from './dto/update-inbox.dto';
import { InboxService } from './inbox.service';

@Controller('inboxs')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Post('check')
  checkCreateTargets(
    @Body() createInboxDto: CreateInboxDto,
    @User() user: LoginUser,
  ) {
    return this.inboxService.checkCreateTargets(createInboxDto, user);
  }
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
