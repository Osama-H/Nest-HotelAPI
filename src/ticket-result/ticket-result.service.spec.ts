import { Test, TestingModule } from '@nestjs/testing';
import { TicketResultService } from './ticket-result.service';

describe('TicketResultService', () => {
  let service: TicketResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketResultService],
    }).compile();

    service = module.get<TicketResultService>(TicketResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
