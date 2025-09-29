import { Test, TestingModule } from '@nestjs/testing';
import { PassengersService } from './passengers.service';
import { getModelToken } from '@nestjs/sequelize';
import { Passenger } from './entities/passenger.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { BookingsService } from '../bookings/bookings.service';

// Mock the helper functions
const mockHandleError = jest.fn();
const mockSuccessMessage = jest.fn();

jest.doMock('../../helps/http-filter.response', () => ({
  handleError: mockHandleError,
  successMessage: mockSuccessMessage,
}));

describe('PassengersService', () => {
  let service: PassengersService;
  let mockPassengerModel: any;
  let mockBookingsService: any;

  const mockPassenger = {
    id: 1,
    booking_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    birth_date: '1990-01-01',
    passport_number: 'AB1234567',
    nationality: 'US',
    seat_label: '12A',
  };

  beforeEach(async () => {
    mockHandleError.mockImplementation((error) => {
      throw error;
    });
    mockSuccessMessage.mockImplementation((data, code = 200) => ({
      statusCode: code,
      message: 'success',
      data,
    }));

    mockPassengerModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    mockBookingsService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassengersService,
        {
          provide: getModelToken(Passenger),
          useValue: mockPassengerModel,
        },
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    service = module.get<PassengersService>(PassengersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPassengerDto: CreatePassengerDto = {
      booking_id: 1,
      first_name: 'John',
      last_name: 'Doe',
      birth_date: '1990-01-01',
      passport_number: 'AB1234567',
      nationality: 'US',
      seat_label: '12A',
    };

    it('should create a passenger successfully', async () => {
      mockBookingsService.findOne.mockResolvedValue({ id: 1 });
      mockPassengerModel.findOne.mockResolvedValue(null);
      mockPassengerModel.create.mockResolvedValue(mockPassenger);

      await service.create(createPassengerDto);

      expect(mockBookingsService.findOne).toHaveBeenCalledWith(1);
      expect(mockPassengerModel.create).toHaveBeenCalledWith(
        createPassengerDto,
      );
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockPassenger, 201);
    });
  });

  describe('findAll', () => {
    it('should return all passengers', async () => {
      mockPassengerModel.findAll.mockResolvedValue([mockPassenger]);
      await service.findAll();
      expect(mockSuccessMessage).toHaveBeenCalledWith([mockPassenger], 200);
    });
  });

  describe('findOne', () => {
    it('should return a passenger by id', async () => {
      mockPassengerModel.findByPk.mockResolvedValue(mockPassenger);
      await service.findOne(1);
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockPassenger, 200);
    });
  });

  describe('update', () => {
    it('should update a passenger', async () => {
      mockPassengerModel.update.mockResolvedValue([1, [mockPassenger]]);
      await service.update(1, { first_name: 'Jane' });
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockPassenger, 200);
    });
  });

  describe('remove', () => {
    it('should remove a passenger', async () => {
      mockPassengerModel.destroy.mockResolvedValue(1);
      await service.remove(1);
      expect(mockSuccessMessage).toHaveBeenCalled();
    });
  });
});
