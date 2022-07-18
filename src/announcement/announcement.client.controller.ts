import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/metas/public.meta';
import { AnnouncementClientService } from './announcement.client.service';
import { ClientSearchAnnouncementsDto } from './dto/client-search-announcements.dto';

@ApiBearerAuth()
@Controller('public/announcements')
@Public()
export class AnnouncementClientController {
  constructor(private readonly service: AnnouncementClientService) {}

  @Get()
  findAll(@Query() query: ClientSearchAnnouncementsDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
