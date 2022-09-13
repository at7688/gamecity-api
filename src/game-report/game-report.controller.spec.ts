import { Test, TestingModule } from '@nestjs/testing';
import { GameReportController } from './game-report.controller';
import { GameReportService } from './game-report.service';

describe('GameReportController', () => {
  let controller: GameReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameReportController],
      providers: [GameReportService],
    }).compile();

    controller = module.get<GameReportController>(GameReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
