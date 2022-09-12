import { Test, TestingModule } from '@nestjs/testing';
import { GameRatioController } from './game-ratio.controller';
import { GameRatioService } from './game-ratio.service';

describe('GameRatioController', () => {
  let controller: GameRatioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameRatioController],
      providers: [GameRatioService],
    }).compile();

    controller = module.get<GameRatioController>(GameRatioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
