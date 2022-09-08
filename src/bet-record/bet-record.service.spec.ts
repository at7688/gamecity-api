import { Test, TestingModule } from '@nestjs/testing';
import { BetRecordService } from './bet-record.service';

describe('BetRecordService', () => {
  let service: BetRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetRecordService],
    }).compile();

    service = module.get<BetRecordService>(BetRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
