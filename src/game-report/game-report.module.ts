import { Module } from '@nestjs/common';
import { GameReportService } from './game-report.service';
import { GameReportController } from './game-report.controller';

@Module({
  controllers: [GameReportController],
  providers: [GameReportService]
})
export class GameReportModule {}
