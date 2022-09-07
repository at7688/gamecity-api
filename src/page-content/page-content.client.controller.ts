import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { SearchPageContentClientDto } from './dto/search-page-content.client.dto';
import { PageContentClientService } from './page-content.client.service';

@Controller('client/page-content')
@Public()
export class PageContentClientController {
  constructor(private readonly pageContentService: PageContentClientService) {}

  @Post()
  findOne(@Body() body: SearchPageContentClientDto) {
    return this.pageContentService.findOne(body);
  }
}
