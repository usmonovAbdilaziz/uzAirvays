import { Test, TestingModule } from '@nestjs/testing';
import { ClassFlightsController } from './class-flights.controller';
import { ClassFlightsService } from './class-flights.service';

describe('ClassFlightsController', () => {
  let controller: ClassFlightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassFlightsController],
      providers: [ClassFlightsService],
    }).compile();

    controller = module.get<ClassFlightsController>(ClassFlightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
