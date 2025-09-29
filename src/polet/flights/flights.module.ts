import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Flight } from './entities/flight.entity';
import { CompaniesModule } from '../companies/companies.module';
import { AirportsModule } from '../airports/airports.module';
import { PlanesModule } from '../planes/planes.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Flight]),
    CompaniesModule,
    AirportsModule,
    PlanesModule,
  ],
  controllers: [FlightsController],
  providers: [FlightsService],
  exports: [FlightsService],
})
export class FlightsModule {}
