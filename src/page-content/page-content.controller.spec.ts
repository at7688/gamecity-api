import { Test, TestingModule } from '@nestjs/testing';
import { PageContentController } from './page-content.controller';
import { PageContentService } from './page-content.service';

describe('PageContentController', () => {
  let controller: PageContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageContentController],
      providers: [PageContentService],
    }).compile();

    controller = module.get<PageContentController>(PageContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
