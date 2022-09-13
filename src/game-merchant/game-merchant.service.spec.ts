import { Test, TestingModule } from '@nestjs/testing';
import { GameMerchantService } from './game-merchant.service';

describe('GameMerchantService', () => {
  let service: GameMerchantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameMerchantService],
    }).compile();

    service = module.get<GameMerchantService>(GameMerchantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
