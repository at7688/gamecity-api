import { Test, TestingModule } from '@nestjs/testing';
import { PBankcardController } from './p-bankcard.controller';
import { PBankcardService } from './p-bankcard.service';

describe('PBankcardController', () => {
  let controller: PBankcardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PBankcardController],
      providers: [PBankcardService],
    }).compile();

    controller = module.get<PBankcardController>(PBankcardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
