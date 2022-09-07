import { SearchBannersClientDto } from './dto/search-banners.client.dto';
import { Body, Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { BannerClientService } from './banner.client.service';

@Controller('client/banners')
@Public()
export class BannerClientController {
  constructor(private readonly bannerService: BannerClientService) {}

  @Get()
  findAll(@Query() query: SearchBannersClientDto) {
    return this.bannerService.findAll(query);
  }
}
