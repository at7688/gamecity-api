import { Test, TestingModule } from '@nestjs/testing';
import { SmsMerchantController } from './sms-merchant.controller';
import { SmsMerchantService } from './sms-merchant.service';

describe('SmsMerchantController', () => {
  let controller: SmsMerchantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmsMerchantController],
      providers: [SmsMerchantService],
    }).compile();

    controller = module.get<SmsMerchantController>(SmsMerchantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
