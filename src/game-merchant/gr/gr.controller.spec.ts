import { Test, TestingModule } from '@nestjs/testing';
import { GrController } from './gr.controller';

describe('GrController', () => {
  let controller: GrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrController],
    }).compile();

    controller = module.get<GrController>(GrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
