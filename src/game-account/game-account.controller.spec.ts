import { Test, TestingModule } from '@nestjs/testing';
import { GameAccountController } from './game-account.controller';
import { GameAccountService } from './game-account.service';

describe('GameAccountController', () => {
  let controller: GameAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameAccountController],
      providers: [GameAccountService],
    }).compile();

    controller = module.get<GameAccountController>(GameAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
