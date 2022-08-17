import { Test, TestingModule } from '@nestjs/testing';
import { PBankcardService } from './p-bankcard.service';

describe('PBankcardService', () => {
  let service: PBankcardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PBankcardService],
    }).compile();

    service = module.get<PBankcardService>(PBankcardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
