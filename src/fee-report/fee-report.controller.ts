import { Body, Controller, Post } from '@nestjs/common';
import { SearchFeeReportDto } from './dto/search-fee-report.dto';
import { FeeReportService } from './fee-report.service';

@Controller('fee-report')
export class FeeReportController {
  constructor(private readonly feeReportService: FeeReportService) {}

  @Post()
  async findAll(@Body() search: SearchFeeReportDto) {
    return this.feeReportService.findAll(search);
  }
}
