import { Test, TestingModule } from '@nestjs/testing';
import { VipController } from './vip.controller';
import { VipService } from './vip.service';

describe('VipController', () => {
  let controller: VipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VipController],
      providers: [VipService],
    }).compile();

    controller = module.get<VipController>(VipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
