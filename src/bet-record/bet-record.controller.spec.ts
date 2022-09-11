import { Test, TestingModule } from '@nestjs/testing';
import { BetRecordController } from './bet-record.controller';

describe('BetRecordController', () => {
  let controller: BetRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BetRecordController],
    }).compile();

    controller = module.get<BetRecordController>(BetRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
