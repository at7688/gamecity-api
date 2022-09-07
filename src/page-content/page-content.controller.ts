import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { CreatePageContentDto } from './dto/create-page-content.dto';
import { SearchPageContentsDto } from './dto/search-page-contents.dto';
import { UpdatePageContentDto } from './dto/update-page-content.dto';
import { PageContentService } from './page-content.service';

@Controller('page-contents')
export class PageContentController {
  constructor(private readonly pageContentService: PageContentService) {}

  @Post()
  create(@Body() createPageContentDto: CreatePageContentDto) {
    return this.pageContentService.create(createPageContentDto);
  }

  @Get()
  findAll(@Query() query: SearchPageContentsDto) {
    return this.pageContentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pageContentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePageContentDto: UpdatePageContentDto,
  ) {
    return this.pageContentService.update(id, updatePageContentDto);
  }
}
