import { Test, TestingModule } from '@nestjs/testing';
import { AviaService } from './avia.service';

describe('AviaService', () => {
  let service: AviaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AviaService],
    }).compile();

    service = module.get<AviaService>(AviaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
