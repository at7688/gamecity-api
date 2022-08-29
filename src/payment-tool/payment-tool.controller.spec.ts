import { Test, TestingModule } from '@nestjs/testing';
import { PaymentToolController } from './payment-tool.controller';
import { PaymentToolService } from './payment-tool.service';

describe('PaymentToolController', () => {
  let controller: PaymentToolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentToolController],
      providers: [PaymentToolService],
    }).compile();

    controller = module.get<PaymentToolController>(PaymentToolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
