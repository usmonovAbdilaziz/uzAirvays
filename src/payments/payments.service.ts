import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './entities/payment.entity';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { BookingStatus } from 'src/Roles/roles';
import { BookingsService } from 'src/humans/bookings/bookings.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment) private paymentModel: typeof Payment,
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe, // ✅ provider orqali inject qilamiz
    private readonly bookingService: BookingsService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const { booking_id, currency, provider, metadata } = createPaymentDto;

      const booking = await this.bookingService.findOne(booking_id);
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      const { status, total_amount } = booking.data as {
        status: string;
        total_amount: number;
        [key: string]: any;
      };

      const fixPrice = Math.round(Math.floor(Number(total_amount)) * 100);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: fixPrice,
        currency: currency.toLowerCase(),
        metadata: {
          booking_id,
          ...metadata,
        },
        confirm: true,
        payment_method: 'pm_card_visa',
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      const payment = await this.paymentModel.create({
        booking_id,
        provider,
        provider_transaction_id: paymentIntent.id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: fixPrice,
        currency,
        status,
        metadata,
      });

      return successMessage(
        {
          clientSecret: paymentIntent.client_secret,
          payment,
        },
        201,
      );
    } catch (error) {
      handleError(error);
    }
  }

  async updatePaymentStatus(provider_transaction_id: string, status: string) {
    await this.paymentModel.update(
      { status },
      { where: { provider_transaction_id } },
    );
  }

  async webhook(rawBody: Buffer, sig: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET environment variable is not set');
      throw new BadRequestException('Webhook configuration error');
    }

    let event;

    try {
      // Signature verification
      event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

      if (event.type === 'payment_intent.succeeded') {
        const transactionId = event.data.object.id;

        const payment = await this.paymentModel.findOne({
          where: { provider_transaction_id: transactionId },
        });

        if (!payment) {
          console.warn(
            `Payment with transaction ID ${transactionId} not found`,
          );
          // Payment topilmaganda ham 200 qaytaramiz, chunki bu Stripe uchun normal
          return { received: true, warning: 'Payment not found' };
        }

        const bookingId = payment.booking_id;

        if (!bookingId) {
          throw new BadRequestException('Payment is not linked to any booking');
        }

        const updatedBooking = await this.bookingService.update(bookingId, {
          status: BookingStatus.PAID,
        });

        return successMessage({ data: updatedBooking });
      }

      // Boshqa event turlari uchun ham 200 qaytaramiz
      return { received: true, eventType: event.type };
    } catch (err: any) {
      console.error('Webhook Error:', err.message, err.stack);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  async findAll() {
    try {
      return successMessage(
        await this.paymentModel.findAll({ include: { all: true } }),
      );
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const payment = await this.paymentModel.destroy({ where: { id } });
      if (payment === 0) {
        throw new NotFoundException('Payment not found');
      }
      return successMessage({ message: 'Payment deleted' });
    } catch (error) {
      handleError(error);
    }
  }
}
