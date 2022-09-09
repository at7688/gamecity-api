import { Test, TestingModule } from '@nestjs/testing';
import { GameAccountService } from './game-account.service';

describe('GameAccountService', () => {
  let service: GameAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameAccountService],
    }).compile();

    service = module.get<GameAccountService>(GameAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
