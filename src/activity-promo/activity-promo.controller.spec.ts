import { Test, TestingModule } from '@nestjs/testing';
import { ActivityPromoController } from './activity-promo.controller';
import { ActivityPromoService } from './activity-promo.service';

describe('ActivityPromoController', () => {
  let controller: ActivityPromoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityPromoController],
      providers: [ActivityPromoService],
    }).compile();

    controller = module.get<ActivityPromoController>(ActivityPromoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
