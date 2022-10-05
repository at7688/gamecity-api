import { Controller, Post } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post('rangeCounts')
  getRangeCounts() {
    return this.dashboardService.getRangeCounts();
  }
}
