import { Test, TestingModule } from '@nestjs/testing';
import { BankWithdrawController } from './bank-withdraw.controller';
import { BankWithdrawService } from './bank-withdraw.service';

describe('BankWithdrawController', () => {
  let controller: BankWithdrawController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankWithdrawController],
      providers: [BankWithdrawService],
    }).compile();

    controller = module.get<BankWithdrawController>(BankWithdrawController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
