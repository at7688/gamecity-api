import { Test, TestingModule } from '@nestjs/testing';
import { BwinController } from './bwin.controller';

describe('BwinController', () => {
  let controller: BwinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BwinController],
    }).compile();

    controller = module.get<BwinController>(BwinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
