import { Test, TestingModule } from '@nestjs/testing';
import { BwinService } from './bwin.service';

describe('BwinService', () => {
  let service: BwinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BwinService],
    }).compile();

    service = module.get<BwinService>(BwinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
