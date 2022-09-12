import { Test, TestingModule } from '@nestjs/testing';
import { GameRatioService } from './game-ratio.service';

describe('GameRatioService', () => {
  let service: GameRatioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameRatioService],
    }).compile();

    service = module.get<GameRatioService>(GameRatioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
