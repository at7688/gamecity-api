import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMerchantService } from './payment-merchant.service';

describe('PaymentMerchantService', () => {
  let service: PaymentMerchantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentMerchantService],
    }).compile();

    service = module.get<PaymentMerchantService>(PaymentMerchantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
