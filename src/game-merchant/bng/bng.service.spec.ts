import { Test, TestingModule } from '@nestjs/testing';
import { BngService } from './bng.service';

describe('BngService', () => {
  let service: BngService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BngService],
    }).compile();

    service = module.get<BngService>(BngService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
