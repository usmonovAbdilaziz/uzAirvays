import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { City } from './entities/city.entity';
import { CountriesModule } from '../countries/countries.module';

@Module({
  imports: [SequelizeModule.forFeature([City]), CountriesModule],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
