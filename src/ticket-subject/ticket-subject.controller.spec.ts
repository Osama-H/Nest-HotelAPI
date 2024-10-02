import { Test, TestingModule } from '@nestjs/testing';
import { TicketSubjectController } from './ticket-subject.controller';

describe('TicketSubjectController', () => {
  let controller: TicketSubjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketSubjectController],
    }).compile();

    controller = module.get<TicketSubjectController>(TicketSubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
