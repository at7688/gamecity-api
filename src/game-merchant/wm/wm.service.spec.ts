import { Test, TestingModule } from '@nestjs/testing';
import { WmService } from './wm.service';

describe('WmService', () => {
  let service: WmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WmService],
    }).compile();

    service = module.get<WmService>(WmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
