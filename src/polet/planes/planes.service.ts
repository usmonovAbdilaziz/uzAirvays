import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaneDto } from './dto/create-plane.dto';
import { UpdatePlaneDto } from './dto/update-plane.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Plane } from './entities/plane.entity';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { AirportsService } from '../airports/airports.service';

@Injectable()
export class PlanesService {
  constructor(
    @InjectModel(Plane) private readonly planeModel: typeof Plane,
    private readonly airoportService: AirportsService,
  ) {}
  async create(createPlaneDto: CreatePlaneDto) {
    try {
      const { model, airport_id, registration_number } = createPlaneDto;

      const airoport = await this.airoportService.findOne(airport_id);
      if (!airoport) {
        throw new NotFoundException('Airoport not found');
      }
      const models = await this.planeModel.findOne({ where: { model } });
      if (models) {
        throw new ConflictException('Plane already exists'); // Changed from Error to ConflictException
      }
      const register = await this.planeModel.findOne({
        where: { registration_number },
      });
      if (register) {
        throw new ConflictException('Plane already exists');
      }
      const { econom_seats, premium_seats, lifting_weight } = createPlaneDto;
      const weight = Math.floor(
        lifting_weight / (econom_seats + premium_seats) - 90,
      );
      if (weight < 30) {
        throw new ConflictException(
          'Iltimos lifting weight yuqoriroq bering, odatda 19t (19000) lik samaliyot jami 150 ta yulovchi ola oladi.',
        );
      }

      const load = weight;
      const newPlane = await this.planeModel.create({
        ...createPlaneDto,
        load,
        economy_seats: econom_seats,
        business_seats: premium_seats,
        lifting_weight,
      });

      return successMessage(newPlane, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const planes = await this.planeModel.findAll({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      return successMessage(planes);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const plane = await this.planeModel.findByPk(id, {
        include: { all: true },
      });
      if (!plane) {
        throw new NotFoundException('Plane not found');
      }
      return successMessage(plane);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updatePlaneDto: UpdatePlaneDto) {
    try {
      const [affectedRows, updatedPlanes] = await this.planeModel.update(
        updatePlaneDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (affectedRows == 0) {
        throw new NotFoundException('Plane not found');
      }
      return successMessage(updatedPlanes[0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const plane = await this.planeModel.destroy({ where: { id } });
      if (plane == 0) {
        throw new NotFoundException('Plane not found');
      }
      return successMessage({ message: 'Delete plane from id' });
    } catch (error) {
      handleError(error);
    }
  }
}
