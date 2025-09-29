import { Module } from '@nestjs/common';
import { FlightSeatsService } from './flight-seats.service';
import { FlightSeatsController } from './flight-seats.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FlightSeat } from './entities/flight-seat.entity';
import { FlightSchedulesModule } from '../flight_schedules/flight_schedules.module';
import { ClassFlightsModule } from '../class-flights/class-flights.module';
import { PassengersModule } from 'src/humans/passengers/passengers.module';

@Module({
  imports: [
    SequelizeModule.forFeature([FlightSeat]),
    FlightSchedulesModule,
    ClassFlightsModule,
    PassengersModule,
  ],
  controllers: [FlightSeatsController],
  providers: [FlightSeatsService],
  exports:[FlightSeatsService]
})
export class FlightSeatsModule {}
