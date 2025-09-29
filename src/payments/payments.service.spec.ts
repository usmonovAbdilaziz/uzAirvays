import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { BookingsService } from '../humans/bookings/bookings.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Currency, BookingStatus } from '../Roles/roles';

// Mock Stripe
const mockStripe = {
  paymentIntents: {
    create: jest.fn(),
  },
  webhooks: {
    constructEvent: jest.fn(),
  },
};

// Mock the helper functions
const mockHandleError = jest.fn();
const mockSuccessMessage = jest.fn();

jest.doMock('../helps/http-filter.response', () => ({
  handleError: mockHandleError,
  successMessage: mockSuccessMessage,
}));

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockPaymentModel: any;
  let mockBookingsService: any;

  const mockPayment = {
    id: 1,
    booking_id: 1,
    provider: 'stripe',
    currency: Currency.USD,
    amount: 10000,
    providerTransactionId: 'pi_test123',
    metadata: {},
  };

  const mockBooking = {
    data: {
      id: 1,
      total_amount: 100.5,
      status: BookingStatus.PENDING,
    },
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

    mockPaymentModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      destroy: jest.fn(),
    };

    mockBookingsService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getModelToken(Payment),
          useValue: mockPaymentModel,
        },
        {
          provide: 'STRIPE_CLIENT',
          useValue: mockStripe,
        },
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPaymentDto: CreatePaymentDto = {
      booking_id: 1,
      provider: 'stripe',
      currency: Currency.USD,
      metadata: { test: 'data' },
    };

    it('should create a payment successfully', async () => {
      mockBookingsService.findOne.mockResolvedValue(mockBooking);
      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_test123',
        status: 'succeeded',
      });
      mockPaymentModel.create.mockResolvedValue(mockPayment);

      await service.create(createPaymentDto);

      expect(mockBookingsService.findOne).toHaveBeenCalledWith(1);
      expect(mockStripe.paymentIntents.create).toHaveBeenCalled();
      expect(mockPaymentModel.create).toHaveBeenCalled();
      expect(mockSuccessMessage).toHaveBeenCalled();
    });

    it('should throw NotFoundException when booking not found', async () => {
      mockBookingsService.findOne.mockResolvedValue(null);

      await expect(service.create(createPaymentDto)).rejects.toThrow();
      expect(mockStripe.paymentIntents.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const payments = [mockPayment];
      mockPaymentModel.findAll.mockResolvedValue(payments);

      await service.findAll();

      expect(mockPaymentModel.findAll).toHaveBeenCalledWith({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(payments);
    });
  });

  describe('remove', () => {
    it('should remove a payment successfully', async () => {
      mockPaymentModel.destroy.mockResolvedValue(1);

      await service.remove(1);

      expect(mockPaymentModel.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith({
        message: 'Payment deleted successfully',
      });
    });

    it('should throw NotFoundException when payment not found', async () => {
      mockPaymentModel.destroy.mockResolvedValue(0);

      await expect(service.remove(1)).rejects.toThrow();
    });
  });

  describe('webhook', () => {
    it('should handle successful payment webhook', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test123',
          },
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockPaymentModel.findOne.mockResolvedValue(mockPayment);
      mockBookingsService.update.mockResolvedValue({ data: { updated: true } });

      const rawBody = Buffer.from('test');
      const signature = 'test_signature';

      await service.webhook(rawBody, signature);

      expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
      expect(mockBookingsService.update).toHaveBeenCalledWith(1, {
        status: BookingStatus.PAID,
      });
    });

    it('should throw BadRequestException for invalid webhook', async () => {
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const rawBody = Buffer.from('test');
      const signature = 'invalid_signature';

      await expect(service.webhook(rawBody, signature)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
