import { Test, TestingModule } from '@nestjs/testing';
import { ClientPayService } from './client-pay.service';

describe('ClientPayService', () => {
  let service: ClientPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientPayService],
    }).compile();

    service = module.get<ClientPayService>(ClientPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
