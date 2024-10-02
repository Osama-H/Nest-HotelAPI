import { Test, TestingModule } from '@nestjs/testing';
import { TicketSubjectService } from './ticket-subject.service';

describe('TicketSubjectService', () => {
  let service: TicketSubjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketSubjectService],
    }).compile();

    service = module.get<TicketSubjectService>(TicketSubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
