import { Test, TestingModule } from '@nestjs/testing';
import { GameReportService } from './game-report.service';

describe('GameReportService', () => {
  let service: GameReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameReportService],
    }).compile();

    service = module.get<GameReportService>(GameReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
