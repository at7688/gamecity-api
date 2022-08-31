import { Test, TestingModule } from '@nestjs/testing';
import { MerchantOrderController } from './merchant-order.controller';

describe('MerchantOrderController', () => {
  let controller: MerchantOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantOrderController],
    }).compile();

    controller = module.get<MerchantOrderController>(MerchantOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
