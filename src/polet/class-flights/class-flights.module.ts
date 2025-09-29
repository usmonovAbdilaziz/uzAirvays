import { Module } from '@nestjs/common';
import { ClassFlightsService } from './class-flights.service';
import { ClassFlightsController } from './class-flights.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassFlight } from './entities/class-flight.entity';
import { PlanesModule } from '../planes/planes.module';
import { PassengersModule } from 'src/humans/passengers/passengers.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ClassFlight]),
    PlanesModule,
    PassengersModule,
  ],
  controllers: [ClassFlightsController],
  providers: [ClassFlightsService],
  exports: [ClassFlightsService],
})
export class ClassFlightsModule {}
