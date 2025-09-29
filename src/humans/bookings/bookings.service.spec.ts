import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getModelToken } from '@nestjs/sequelize';
import { Booking } from './entities/booking.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UsersService } from '../../users/users.service';
import { BookingStatus, Currency } from '../../Roles/roles';

// Mock the helper functions
const mockHandleError = jest.fn();
const mockSuccessMessage = jest.fn();

jest.doMock('../../helps/http-filter.response', () => ({
  handleError: mockHandleError,
  successMessage: mockSuccessMessage,
}));

describe('BookingsService', () => {
  let service: BookingsService;
  let mockBookingModel: any;
  let mockUsersService: any;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    full_name: 'Test User',
  };

  const mockBooking = {
    id: 1,
    user_id: 1,
    total_amount: 100.5,
    currency: Currency.USD,
    status: BookingStatus.PENDING,
    note: 'Test booking',
    user: mockUser,
    passengers: [],
    Payments: [],
  };

  beforeEach(async () => {
    // Reset mocks
    mockHandleError.mockImplementation((error) => {
      throw error;
    });
    mockSuccessMessage.mockImplementation((data, code = 200) => ({
      statusCode: code,
      message: 'success',
      data,
    }));

    mockBookingModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    mockUsersService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getModelToken(Booking),
          useValue: mockBookingModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createBookingDto: CreateBookingDto = {
      user_id: 1,
      total_amount: 100.5,
      currency: Currency.USD,
      status: BookingStatus.PENDING,
      note: 'Test booking',
    };

    it('should create a new booking successfully', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockBookingModel.create.mockResolvedValue(mockBooking);

      await service.create(createBookingDto);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
      expect(mockBookingModel.create).toHaveBeenCalledWith(createBookingDto);
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockBooking, 201);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.create(createBookingDto)).rejects.toThrow();
      expect(mockBookingModel.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all bookings with relations', async () => {
      const bookings = [mockBooking];
      mockBookingModel.findAll.mockResolvedValue(bookings);

      await service.findAll();

      expect(mockBookingModel.findAll).toHaveBeenCalledWith({
        include: { all: true },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(bookings, 200);
    });
  });

  describe('findOne', () => {
    it('should return a booking by id with relations', async () => {
      mockBookingModel.findByPk.mockResolvedValue(mockBooking);

      await service.findOne(1);

      expect(mockBookingModel.findByPk).toHaveBeenCalledWith(1, {
        include: { all: true },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockBooking, 200);
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockBookingModel.findByPk.mockResolvedValue(null);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updateBookingDto: UpdateBookingDto = {
      status: BookingStatus.CONFIRMED,
    };

    it('should update a booking successfully', async () => {
      const updatedBooking = {
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
      };
      mockBookingModel.update.mockResolvedValue([1, [updatedBooking]]);

      await service.update(1, updateBookingDto);

      expect(mockBookingModel.update).toHaveBeenCalledWith(updateBookingDto, {
        where: { id: 1 },
        returning: true,
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(updatedBooking, 200);
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockBookingModel.update.mockResolvedValue([0, []]);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.update(1, updateBookingDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a booking successfully', async () => {
      mockBookingModel.destroy.mockResolvedValue(1);

      await service.remove(1);

      expect(mockBookingModel.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(
        { message: 'Delete booking from id' },
        200,
      );
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockBookingModel.destroy.mockResolvedValue(0);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.remove(1)).rejects.toThrow();
    });
  });
});
