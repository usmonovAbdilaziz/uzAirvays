import { Module } from '@nestjs/common';
import { FlightSchedulesService } from './flight_schedules.service';
import { FlightSchedulesController } from './flight_schedules.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FlightSchedule } from './entities/flight_schedule.entity';
import { PlanesModule } from '../planes/planes.module';
import { FlightsModule } from '../flights/flights.module';

@Module({
  imports: [
    SequelizeModule.forFeature([FlightSchedule]),
    PlanesModule,
    FlightsModule,
  ],
  controllers: [FlightSchedulesController],
  providers: [FlightSchedulesService],
  exports: [FlightSchedulesService],
})
export class FlightSchedulesModule {}
