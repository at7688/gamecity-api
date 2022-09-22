import { Body, Controller, Post } from '@nestjs/common';
import { PlatformType } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';
import { SearchAgentReportDto } from './dto/search-agent-report.dto';
import { SearchGameReportsDto } from './dto/search-game-reports.dto';
import { GameReportService } from './game-report.service';

@Controller('game-report')
@Platforms([PlatformType.PLAYER])
export class GameReportController {
  constructor(private readonly gameReportService: GameReportService) {}

  @Post('platform')
  findAllByPlatform(@Body() body: SearchGameReportsDto) {
    return this.gameReportService.findAll('platform_code', body);
  }

  @Post('category')
  findAllByCategory(@Body() body: SearchGameReportsDto) {
    return this.gameReportService.findAll('category_code', body);
  }

  @Post('winlose')
  winLoseReport(@Body() body: SearchAgentReportDto) {
    return this.gameReportService.winLoseReport(body);
  }
}
