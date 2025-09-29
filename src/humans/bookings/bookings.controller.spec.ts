import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus, Currency } from '../../Roles/roles';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  const mockSuccessResponse = {
    statusCode: 200,
    message: 'success',
    data: {},
  };

  const mockBookingsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new booking', async () => {
      const createBookingDto: CreateBookingDto = {
        user_id: 1,
        total_amount: 100.5,
        currency: Currency.USD,
        status: BookingStatus.PENDING,
        note: 'Test booking',
      };

      const expectedResult = {
        ...mockSuccessResponse,
        statusCode: 201,
        data: { id: 1, ...createBookingDto },
      };

      mockBookingsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createBookingDto);

      expect(service.create).toHaveBeenCalledWith(createBookingDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all bookings', async () => {
      const bookings = [
        {
          id: 1,
          user_id: 1,
          total_amount: 100.5,
          currency: Currency.USD,
          status: BookingStatus.PENDING,
        },
      ];
      const expectedResult = {
        ...mockSuccessResponse,
        data: bookings,
      };

      mockBookingsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a booking by id', async () => {
      const booking = {
        id: 1,
        user_id: 1,
        total_amount: 100.5,
        currency: Currency.USD,
        status: BookingStatus.PENDING,
      };
      const expectedResult = {
        ...mockSuccessResponse,
        data: booking,
      };

      mockBookingsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: BookingStatus.CONFIRMED,
      };
      const updatedBooking = {
        id: 1,
        user_id: 1,
        total_amount: 100.5,
        currency: Currency.USD,
        status: BookingStatus.CONFIRMED,
      };
      const expectedResult = {
        ...mockSuccessResponse,
        data: updatedBooking,
      };

      mockBookingsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateBookingDto);

      expect(service.update).toHaveBeenCalledWith(1, updateBookingDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a booking', async () => {
      const expectedResult = {
        ...mockSuccessResponse,
        data: { message: 'Delete booking from id' },
      };

      mockBookingsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
