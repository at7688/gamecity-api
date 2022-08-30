import { Test, TestingModule } from '@nestjs/testing';
import { PaymentDepositController } from './payment-deposit.controller';
import { PaymentDepositService } from './payment-deposit.service';

describe('PaymentDepositController', () => {
  let controller: PaymentDepositController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentDepositController],
      providers: [PaymentDepositService],
    }).compile();

    controller = module.get<PaymentDepositController>(PaymentDepositController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
