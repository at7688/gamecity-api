import { Body, Controller, Post } from '@nestjs/common';
import { SearchGameReportsDto } from './dto/search-game-reports.dto';
import { GameReportService } from './game-report.service';

@Controller('game-report')
export class GameReportController {
  constructor(private readonly gameReportService: GameReportService) {}

  @Post('list')
  findAll(@Body() body: SearchGameReportsDto) {
    return this.gameReportService.findAll(body);
  }
}
