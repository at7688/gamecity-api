import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMerchantController } from './payment-merchant.controller';
import { PaymentMerchantService } from './payment-merchant.service';

describe('PaymentMerchantController', () => {
  let controller: PaymentMerchantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentMerchantController],
      providers: [PaymentMerchantService],
    }).compile();

    controller = module.get<PaymentMerchantController>(PaymentMerchantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
