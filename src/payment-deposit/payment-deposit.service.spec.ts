import { Test, TestingModule } from '@nestjs/testing';
import { PaymentDepositService } from './payment-deposit.service';

describe('PaymentDepositService', () => {
  let service: PaymentDepositService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentDepositService],
    }).compile();

    service = module.get<PaymentDepositService>(PaymentDepositService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
