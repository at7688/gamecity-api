import { Test, TestingModule } from '@nestjs/testing';
import { PaywayService } from './payway.service';

describe('PaywayService', () => {
  let service: PaywayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaywayService],
    }).compile();

    service = module.get<PaywayService>(PaywayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
