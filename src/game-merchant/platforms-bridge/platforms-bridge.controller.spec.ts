import { Test, TestingModule } from '@nestjs/testing';
import { PlatformsBridgeController } from './platforms-bridge.controller';

describe('PlatformsBridgeController', () => {
  let controller: PlatformsBridgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformsBridgeController],
    }).compile();

    controller = module.get<PlatformsBridgeController>(PlatformsBridgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
