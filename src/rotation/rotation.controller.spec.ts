import { Test, TestingModule } from '@nestjs/testing';
import { RotationController } from './rotation.controller';
import { RotationService } from './rotation.service';

describe('RotationController', () => {
  let controller: RotationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RotationController],
      providers: [RotationService],
    }).compile();

    controller = module.get<RotationController>(RotationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
