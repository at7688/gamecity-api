import { Test, TestingModule } from '@nestjs/testing';
import { CBankcardService } from './c-bankcard.service';

describe('CBankcardService', () => {
  let service: CBankcardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CBankcardService],
    }).compile();

    service = module.get<CBankcardService>(CBankcardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
