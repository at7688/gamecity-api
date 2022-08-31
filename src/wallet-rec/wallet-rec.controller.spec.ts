import { Test, TestingModule } from '@nestjs/testing';
import { WalletRecController } from './wallet-rec.controller';
import { WalletRecService } from './wallet-rec.service';

describe('WalletRecController', () => {
  let controller: WalletRecController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletRecController],
      providers: [WalletRecService],
    }).compile();

    controller = module.get<WalletRecController>(WalletRecController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
