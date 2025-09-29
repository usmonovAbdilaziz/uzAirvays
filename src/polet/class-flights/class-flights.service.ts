import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassFlightDto } from './dto/create-class-flight.dto';
import { UpdateClassFlightDto } from './dto/update-class-flight.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ClassFlight } from './entities/class-flight.entity';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { PlanesService } from '../planes/planes.service';
import { PassengersService } from 'src/humans/passengers/passengers.service';

@Injectable()
export class ClassFlightsService {
  constructor(
    @InjectModel(ClassFlight)
    private readonly classFlightModel: typeof ClassFlight,
    private readonly passengerService: PassengersService,
    private readonly planeServise: PlanesService,
  ) {}

  async create(createClassFlightDto: CreateClassFlightDto) {
    try {
      const { code, plane_id, passenger_id } = createClassFlightDto;
      const plane = await this.planeServise.findOne(plane_id);
      const passenger = await this.passengerService.findOne(passenger_id);
      if (!plane) {
        throw new NotFoundException('Plane not found');
      }
      if (!passenger) {
        throw new NotFoundException('Passenger not found');
      }
      const passager = await this.classFlightModel.findOne({
        where: {
          passenger_id,
          plane_id,
        },
      });
      if (passager) {
        throw new ConflictException(
          'Passenger already has a class flight for this plane',
        );
      }
      const planeData = plane?.data as { load: number; [key: string]: any };
      const { load } = planeData;
      const displayName = code;

      const newClassFlight = await this.classFlightModel.create({
        ...createClassFlightDto,
        display_name: displayName,
        baggage_allowance_kg: load,
      });
      return successMessage(newClassFlight, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const classFlights = await this.classFlightModel.findAll({
        order: [['id', 'DESC']],
        include: { all: true },
      });
      return successMessage(classFlights);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const classFlight = await this.classFlightModel.findByPk(id, {
        include: { all: true },
      });
      if (!classFlight) {
        throw new NotFoundException('Class flight not found');
      }
      return successMessage(classFlight);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateClassFlightDto: UpdateClassFlightDto) {
    try {
      // Check if class flight exists
      const existingClassFlight = await this.classFlightModel.findByPk(id);
      if (!existingClassFlight) {
        throw new NotFoundException('Class flight not found');
      }

      // If code is being updated, check for uniqueness
      if (updateClassFlightDto.code) {
        const existingCode = await this.classFlightModel.findOne({
          where: {
            code: updateClassFlightDto.code,
            id: { [require('sequelize').Op.ne]: id },
          },
        });
        if (existingCode) {
          throw new ConflictException('Class with this code already exists');
        }
      }

      // If display_name is being updated, check for uniqueness
      if (updateClassFlightDto.code) {
        const existingName = await this.classFlightModel.findOne({
          where: {
            code: updateClassFlightDto.code,
            id: { [require('sequelize').Op.ne]: id },
          },
        });
        if (existingName) {
          throw new ConflictException(
            'Class with this display name already exists',
          );
        }
      }

      const [affectedRows, updatedClassFlights] =
        await this.classFlightModel.update(updateClassFlightDto, {
          where: { id },
          returning: true,
        });

      if (affectedRows === 0) {
        throw new NotFoundException('Class flight not found');
      }

      return successMessage(updatedClassFlights[0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const classFlight = await this.classFlightModel.destroy({
        where: { id },
      });
      if (classFlight === 0) {
        throw new NotFoundException('Class flight not found');
      }
      return successMessage({ message: 'Class flight deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
