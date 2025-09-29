import { Module } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Airport } from './entities/airport.entity';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [SequelizeModule.forFeature([Airport]), CompaniesModule],
  controllers: [AirportsController],
  providers: [AirportsService],
  exports: [AirportsService],
})
export class AirportsModule {}
