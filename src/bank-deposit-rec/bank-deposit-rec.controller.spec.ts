import { Test, TestingModule } from '@nestjs/testing';
import { BankDepositRecController } from './bank-deposit-rec.controller';
import { BankDepositRecService } from './bank-deposit-rec.service';

describe('BankDepositRecController', () => {
  let controller: BankDepositRecController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankDepositRecController],
      providers: [BankDepositRecService],
    }).compile();

    controller = module.get<BankDepositRecController>(BankDepositRecController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
