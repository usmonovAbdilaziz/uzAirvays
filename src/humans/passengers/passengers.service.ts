import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { InjectModel } from '@nestjs/sequelize';
import { Passenger } from './entities/passenger.entity';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PassengersService {
  constructor(
    @InjectModel(Passenger) private readonly passengerModel: typeof Passenger,
    private readonly bookingService: BookingsService,
  ) {}
  async create(createPassengerDto: CreatePassengerDto) {
    try {
      const { passport_number } = createPassengerDto;

      // Check if passenger with this passport number already exists
      const existingPassenger = await this.passengerModel.findOne({
        where: { passport_number },
      });
      if (existingPassenger) {
        throw new ConflictException('Bu yulovchi oldin ruyxatdan utgan');
      }

      const passenger = await this.passengerModel.create({
        ...createPassengerDto,
      });
      return successMessage(passenger, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const passengers = await this.passengerModel.findAll({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      return successMessage(passengers);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const passenger = await this.passengerModel.findByPk(id, {
        include: { all: true },
      });
      if (!passenger) {
        throw new NotFoundException('Passenger not found');
      }
      return successMessage(passenger);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updatePassengerDto: UpdatePassengerDto) {
    try {
      const [affectedRows, updatedPassengers] =
        await this.passengerModel.update(updatePassengerDto, {
          where: { id },
          returning: true,
        });
      if (affectedRows == 0) {
        throw new NotFoundException('Passenger not found');
      }
      return successMessage(updatedPassengers[0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const passenger = await this.passengerModel.destroy({ where: { id } });
      if (passenger == 0) {
        throw new NotFoundException('Passenger not found');
      }
      return successMessage({ message: 'Deleted passenger from id' });
    } catch (error) {
      handleError(error);
    }
  }
}
