import { Body, Controller, Post } from '@nestjs/common';
import { PlatformType } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';
import { SearchAgentReportDto } from './dto/search-agent-report.dto';
import { SearchGameReportsDto } from './dto/search-game-reports.dto';
import { SearchPlayerReportDto } from './dto/search-player-report.dto';
import { GameReportService } from './game-report.service';

@Controller('report')
@Platforms([PlatformType.PLAYER])
export class GameReportController {
  constructor(private readonly gameReportService: GameReportService) {}

  @Post('game')
  findAll(@Body() body: SearchGameReportsDto) {
    return this.gameReportService.findAll(body);
  }

  @Post('agent')
  winLoseReport(@Body() body: SearchAgentReportDto) {
    return this.gameReportService.winLoseReport(body);
  }

  @Post('player')
  playerReport(@Body() body: SearchPlayerReportDto) {
    return this.gameReportService.playerReport(body);
  }
}
