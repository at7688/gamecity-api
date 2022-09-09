import { Test, TestingModule } from '@nestjs/testing';
import { AviaController } from './avia.controller';

describe('AviaController', () => {
  let controller: AviaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AviaController],
    }).compile();

    controller = module.get<AviaController>(AviaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
