import { Test, TestingModule } from '@nestjs/testing';
import { GamePlatformService } from './game-platform.service';

describe('GamePlatformService', () => {
  let service: GamePlatformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamePlatformService],
    }).compile();

    service = module.get<GamePlatformService>(GamePlatformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
