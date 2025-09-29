import { Test, TestingModule } from '@nestjs/testing';
import { ClassFlightsService } from './class-flights.service';

describe('ClassFlightsService', () => {
  let service: ClassFlightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassFlightsService],
    }).compile();

    service = module.get<ClassFlightsService>(ClassFlightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
