import { Module } from '@nestjs/common';
import { PlanesService } from './planes.service';
import { PlanesController } from './planes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plane } from './entities/plane.entity';
import { CompaniesModule } from '../companies/companies.module';
import { AirportsModule } from '../airports/airports.module';

@Module({
  imports: [SequelizeModule.forFeature([Plane]), AirportsModule],
  controllers: [PlanesController],
  providers: [PlanesService],
  exports: [PlanesService],
})
export class PlanesModule {}
