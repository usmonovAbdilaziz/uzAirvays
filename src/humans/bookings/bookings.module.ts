import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './entities/booking.entity';
import { UsersModule } from 'src/users/users.module';
import { FlightSchedulesModule } from 'src/polet/flight_schedules/flight_schedules.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Booking]),
    UsersModule,
    FlightSchedulesModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
