import { Module } from '@nestjs/common';
import { Ticket } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TicketsController } from './tickets.controller';
import { BookingsModule } from '../bookings/bookings.module';
import { PassengersModule } from '../passengers/passengers.module';
import { FlightSeatsModule } from '../../polet/flight-seats/flight-seats.module';
import { ClassFlightsModule } from '../../polet/class-flights/class-flights.module';
import { FlightsModule } from '../../polet/flights/flights.module';
import { FlightSchedulesModule } from '../../polet/flight_schedules/flight_schedules.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Ticket]),
    BookingsModule,
    ClassFlightsModule,
    PassengersModule,
    FlightSeatsModule,
    FlightsModule,
    FlightSchedulesModule
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
