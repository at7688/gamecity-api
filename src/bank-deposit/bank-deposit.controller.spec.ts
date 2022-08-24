import { Test, TestingModule } from '@nestjs/testing';
import { BankDepositController } from './bank-deposit.controller';
import { BankDepositService } from './bank-deposit.service';

describe('BankDepositController', () => {
  let controller: BankDepositController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankDepositController],
      providers: [BankDepositService],
    }).compile();

    controller = module.get<BankDepositController>(BankDepositController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
