import { Test, TestingModule } from '@nestjs/testing';
import { BankWithdrawService } from './bank-withdraw.service';

describe('BankWithdrawService', () => {
  let service: BankWithdrawService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankWithdrawService],
    }).compile();

    service = module.get<BankWithdrawService>(BankWithdrawService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
