import { Test, TestingModule } from '@nestjs/testing';
import { BankDepositService } from './bank-deposit.service';

describe('BankDepositService', () => {
  let service: BankDepositService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankDepositService],
    }).compile();

    service = module.get<BankDepositService>(BankDepositService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
