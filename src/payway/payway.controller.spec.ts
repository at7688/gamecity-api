import { Test, TestingModule } from '@nestjs/testing';
import { PaywayController } from './payway.controller';
import { PaywayService } from './payway.service';

describe('PaywayController', () => {
  let controller: PaywayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaywayController],
      providers: [PaywayService],
    }).compile();

    controller = module.get<PaywayController>(PaywayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
