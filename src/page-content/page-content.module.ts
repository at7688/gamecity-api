import { Module } from '@nestjs/common';
import { PageContentService } from './page-content.service';
import { PageContentController } from './page-content.controller';
import { PageContentClientController } from './page-content.client.controller';
import { PageContentClientService } from './page-content.client.service';

@Module({
  controllers: [PageContentController, PageContentClientController],
  providers: [PageContentService, PageContentClientService],
})
export class PageContentModule {}
