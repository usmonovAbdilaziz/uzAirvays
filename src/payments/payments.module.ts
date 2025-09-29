import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './entities/payment.entity';
import { BookingsModule } from 'src/humans/bookings/bookings.module';
import { StripeProvider } from 'src/stripe/stripe-providers';

@Module({
  imports: [SequelizeModule.forFeature([Payment]), BookingsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeProvider],
})
export class PaymentsModule {}
