import { Test, TestingModule } from '@nestjs/testing';
import { ClientPayController } from './client-pay.controller';

describe('ClientPayController', () => {
  let controller: ClientPayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientPayController],
    }).compile();

    controller = module.get<ClientPayController>(ClientPayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
