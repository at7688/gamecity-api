import { Test, TestingModule } from '@nestjs/testing';
import { PaymentToolService } from './payment-tool.service';

describe('PaymentToolService', () => {
  let service: PaymentToolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentToolService],
    }).compile();

    service = module.get<PaymentToolService>(PaymentToolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
