import { Test, TestingModule } from '@nestjs/testing';
import { ZgService } from './zg.service';

describe('ZgService', () => {
  let service: ZgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZgService],
    }).compile();

    service = module.get<ZgService>(ZgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
