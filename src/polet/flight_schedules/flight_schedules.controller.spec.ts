import { Test, TestingModule } from '@nestjs/testing';
import { FlightSchedulesController } from './flight_schedules.controller';
import { FlightSchedulesService } from './flight_schedules.service';

describe('FlightSchedulesController', () => {
  let controller: FlightSchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightSchedulesController],
      providers: [FlightSchedulesService],
    }).compile();

    controller = module.get<FlightSchedulesController>(
      FlightSchedulesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
