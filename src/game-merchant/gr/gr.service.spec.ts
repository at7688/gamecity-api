import { Test, TestingModule } from '@nestjs/testing';
import { GrService } from './gr.service';

describe('GrService', () => {
  let service: GrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrService],
    }).compile();

    service = module.get<GrService>(GrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
