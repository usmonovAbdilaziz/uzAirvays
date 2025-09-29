import { Test, TestingModule } from '@nestjs/testing';
import { FlightSeatsService } from './flight-seats.service';

describe('FlightSeatsService', () => {
  let service: FlightSeatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlightSeatsService],
    }).compile();

    service = module.get<FlightSeatsService>(FlightSeatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
