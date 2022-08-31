import { Test, TestingModule } from '@nestjs/testing';
import { MerchantOrderService } from './merchant-order.service';

describe('MerchantOrderService', () => {
  let service: MerchantOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantOrderService],
    }).compile();

    service = module.get<MerchantOrderService>(MerchantOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
