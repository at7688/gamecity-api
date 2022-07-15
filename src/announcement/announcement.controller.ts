import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { SearchAnnouncementsDto } from './dto/search-announcements.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@ApiBearerAuth()
@Controller({
  path: 'announcements',
  // version: '1',
})
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Delete('clean-before')
  cleanBeforeDay(@Body() { day }: { day: Date | string }) {
    return this.announcementService.cleanBeforeDay(day);
  }
  @Post('batch')
  batchCreate(@Body('data') list: CreateAnnouncementDto[]) {
    return this.announcementService.batchCreate(list);
  }
  @Post('oldnews')
  injectFromOld(
    @Body()
    data: {
      title: string;
      content: string;
      category: number;
      createdAt: string;
      startAt: string;
      endAt: string;
      isRedirect: boolean;
      sort: number;
      platform: number;
    }[],
  ) {
    return this.announcementService.injectOldList(data);
  }

  @Post()
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @Get()
  findAll(@Query() query: SearchAnnouncementsDto) {
    return this.announcementService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementService.remove(id);
  }
}
