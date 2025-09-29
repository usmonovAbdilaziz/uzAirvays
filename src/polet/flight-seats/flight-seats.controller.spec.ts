import { Test, TestingModule } from '@nestjs/testing';
import { FlightSeatsController } from './flight-seats.controller';
import { FlightSeatsService } from './flight-seats.service';

describe('FlightSeatsController', () => {
  let controller: FlightSeatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightSeatsController],
      providers: [FlightSeatsService],
    }).compile();

    controller = module.get<FlightSeatsController>(FlightSeatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
