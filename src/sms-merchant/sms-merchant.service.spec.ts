import { Test, TestingModule } from '@nestjs/testing';
import { SmsMerchantService } from './sms-merchant.service';

describe('SmsMerchantService', () => {
  let service: SmsMerchantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsMerchantService],
    }).compile();

    service = module.get<SmsMerchantService>(SmsMerchantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
