import { Test, TestingModule } from '@nestjs/testing';
import { BankDepositRecService } from './bank-deposit-rec.service';

describe('BankDepositRecService', () => {
  let service: BankDepositRecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankDepositRecService],
    }).compile();

    service = module.get<BankDepositRecService>(BankDepositRecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
