import { Module } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { PassengersController } from './passengers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Passenger } from './entities/passenger.entity';
import { BookingsModule } from '../bookings/bookings.module';
import { Plane } from 'src/polet/planes/entities/plane.entity';

@Module({
  imports: [SequelizeModule.forFeature([Passenger]), BookingsModule],
  controllers: [PassengersController],
  providers: [PassengersService],
  exports: [PassengersService],
})
export class PassengersModule {}
