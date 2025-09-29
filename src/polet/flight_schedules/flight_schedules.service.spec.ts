import { Test, TestingModule } from '@nestjs/testing';
import { FlightSchedulesService } from './flight_schedules.service';

describe('FlightSchedulesService', () => {
  let service: FlightSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlightSchedulesService],
    }).compile();

    service = module.get<FlightSchedulesService>(FlightSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
