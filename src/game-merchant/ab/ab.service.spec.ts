import { Test, TestingModule } from '@nestjs/testing';
import { AbService } from './ab.service';

describe('AbService', () => {
  let service: AbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbService],
    }).compile();

    service = module.get<AbService>(AbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
