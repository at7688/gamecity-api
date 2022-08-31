import { Test, TestingModule } from '@nestjs/testing';
import { WalletRecService } from './wallet-rec.service';

describe('WalletRecService', () => {
  let service: WalletRecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletRecService],
    }).compile();

    service = module.get<WalletRecService>(WalletRecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
