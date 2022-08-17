import { Test, TestingModule } from '@nestjs/testing';
import { RotationService } from './rotation.service';

describe('RotationService', () => {
  let service: RotationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RotationService],
    }).compile();

    service = module.get<RotationService>(RotationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
