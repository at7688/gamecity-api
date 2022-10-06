import { Controller, Get, Post } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post('rangeCounts')
  getRangeCounts() {
    return this.dashboardService.getRangeCounts();
  }
  @Get('playerCount')
  getPlayerCount() {
    return this.dashboardService.getPlayerCount();
  }

  @Get('winlose')
  winloseResult() {
    return this.dashboardService.winloseResult();
  }
}
