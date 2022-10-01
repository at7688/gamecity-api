import { Test, TestingModule } from '@nestjs/testing';
import { RecordTicketService } from './record-ticket.service';

describe('RecordTicketService', () => {
  let service: RecordTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordTicketService],
    }).compile();

    service = module.get<RecordTicketService>(RecordTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
