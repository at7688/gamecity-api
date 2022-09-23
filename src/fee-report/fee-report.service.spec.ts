import { Test, TestingModule } from '@nestjs/testing';
import { FeeReportService } from './fee-report.service';

describe('FeeReportService', () => {
  let service: FeeReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeeReportService],
    }).compile();

    service = module.get<FeeReportService>(FeeReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
