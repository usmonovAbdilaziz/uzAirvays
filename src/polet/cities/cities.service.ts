import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { InjectModel } from '@nestjs/sequelize';
import { City } from './entities/city.entity';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City) private readonly cityModel: typeof City,
    private readonly countryService: CountriesService,
  ) {}

  // CREATE
  async create(createCityDto: CreateCityDto) {
    try {
      const { name, country_id } = createCityDto;
      const country = await this.countryService.findOne(country_id);

      if (!country) {
        throw new NotFoundException('Country not found');
      }
      const exist = await this.cityModel.findOne({ where: { name } });
      if (exist) {
        throw new ConflictException(`City with name "${name}" already exists`);
      }

      const newCity = await this.cityModel.create({ ...createCityDto });
      return successMessage(newCity, 201);
    } catch (error) {
      handleError(error);
    }
  }

  // FIND ALL
  async findAll() {
    try {
      const cities = await this.cityModel.findAll({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      return successMessage(cities);
    } catch (error) {
      handleError(error);
    }
  }

  // FIND ONE
  async findOne(id: number) {
    try {
      const city = await this.cityModel.findByPk(id, {
        include: { all: true },
      });
      if (!city) {
        throw new NotFoundException(`City not found`);
      }
      return successMessage(city);
    } catch (error) {
      handleError(error);
    }
  }

  // UPDATE
  async update(id: number, updateCityDto: UpdateCityDto) {
    try {
      const [affectedRows, updatedCities] = await this.cityModel.update(
        updateCityDto,
        {
          where: { id },
          returning: true,
        },
      );

      if (affectedRows === 0) {
        throw new NotFoundException(`City not found`);
      }

      return successMessage(updatedCities[0]);
    } catch (error) {
      handleError(error);
    }
  }

  // REMOVE
  async remove(id: number) {
    try {
      const deleted = await this.cityModel.destroy({ where: { id } });
      if (deleted === 0) {
        throw new NotFoundException(`City not found`);
      }
      return successMessage({ message: `City deleted successfully` });
    } catch (error) {
      handleError(error);
    }
  }
}
