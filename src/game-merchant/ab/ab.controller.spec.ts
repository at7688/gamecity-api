import { Test, TestingModule } from '@nestjs/testing';
import { AbController } from './ab.controller';

describe('AbController', () => {
  let controller: AbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbController],
    }).compile();

    controller = module.get<AbController>(AbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
