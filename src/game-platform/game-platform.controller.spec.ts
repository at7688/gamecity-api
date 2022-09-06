import { Test, TestingModule } from '@nestjs/testing';
import { GamePlatformController } from './game-platform.controller';
import { GamePlatformService } from './game-platform.service';

describe('GamePlatformController', () => {
  let controller: GamePlatformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamePlatformController],
      providers: [GamePlatformService],
    }).compile();

    controller = module.get<GamePlatformController>(GamePlatformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
