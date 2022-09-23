import { Test, TestingModule } from '@nestjs/testing';
import { FeeReportController } from './fee-report.controller';
import { FeeReportService } from './fee-report.service';

describe('FeeReportController', () => {
  let controller: FeeReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeeReportController],
      providers: [FeeReportService],
    }).compile();

    controller = module.get<FeeReportController>(FeeReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
