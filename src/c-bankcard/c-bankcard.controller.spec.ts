import { Test, TestingModule } from '@nestjs/testing';
import { CBankcardController } from './c-bankcard.controller';
import { CBankcardService } from './c-bankcard.service';

describe('CBankcardController', () => {
  let controller: CBankcardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CBankcardController],
      providers: [CBankcardService],
    }).compile();

    controller = module.get<CBankcardController>(CBankcardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
