import { Test, TestingModule } from '@nestjs/testing';
import { TicketResultController } from './ticket-result.controller';

describe('TicketResultController', () => {
  let controller: TicketResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketResultController],
    }).compile();

    controller = module.get<TicketResultController>(TicketResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
