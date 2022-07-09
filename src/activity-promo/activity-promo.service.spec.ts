import { Test, TestingModule } from '@nestjs/testing';
import { ActivityPromoService } from './activity-promo.service';

describe('ActivityPromoService', () => {
  let service: ActivityPromoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityPromoService],
    }).compile();

    service = module.get<ActivityPromoService>(ActivityPromoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
