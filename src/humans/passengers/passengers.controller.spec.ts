import { Test, TestingModule } from '@nestjs/testing';
import { PassengersController } from './passengers.controller';
import { PassengersService } from './passengers.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { SeatCol } from '../../Roles/roles';

describe('PassengersController', () => {
  let controller: PassengersController;
  let service: PassengersService;

  const mockPassengersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengersController],
      providers: [
        {
          provide: PassengersService,
          useValue: mockPassengersService,
        },
      ],
    }).compile();

    controller = module.get<PassengersController>(PassengersController);
    service = module.get<PassengersService>(PassengersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a passenger', async () => {
      const createDto: CreatePassengerDto = {
        first_name: 'John',
        last_name: 'Doe',
        birth_date: '1990-01-01',
        passport_number: 'AB1234567',
        nationality: 'US',
      };
      const expectedResult = { statusCode: 201, data: { id: 1, ...createDto } };
      mockPassengersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('CRUD operations', () => {
    it('should find all passengers', async () => {
      mockPassengersService.findAll.mockResolvedValue({ data: [] });
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should find one passenger', async () => {
      mockPassengersService.findOne.mockResolvedValue({ data: {} });
      await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should update a passenger', async () => {
      const updateDto: UpdatePassengerDto = { first_name: 'Jane' };
      mockPassengersService.update.mockResolvedValue({ data: {} });
      await controller.update('1', updateDto);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should remove a passenger', async () => {
      mockPassengersService.remove.mockResolvedValue({ data: {} });
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
