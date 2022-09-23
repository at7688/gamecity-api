import { Module } from '@nestjs/common';
import { FeeReportService } from './fee-report.service';
import { FeeReportController } from './fee-report.controller';

@Module({
  controllers: [FeeReportController],
  providers: [FeeReportService]
})
export class FeeReportModule {}
