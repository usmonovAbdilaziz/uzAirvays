import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { InjectModel } from '@nestjs/sequelize';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country) private readonly countryModel: typeof Country,
  ) {}

  // CREATE
  async create(createCountryDto: CreateCountryDto) {
    try {
      const { name } = createCountryDto;
      const exist = await this.countryModel.findOne({ where: { name } });

      if (exist) {
        throw new BadRequestException(
          `Country with name "${name}" already exists`,
        );
      }

      const newCountry = await this.countryModel.create({
        ...createCountryDto,
      });
      return successMessage(newCountry, 201);
    } catch (error) {
      handleError(error);
    }
  }

  // FIND ALL
  async findAll() {
    try {
      const countries = await this.countryModel.findAll({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      return successMessage(countries);
    } catch (error) {
      handleError(error);
    }
  }

  // FIND ONE
  async findOne(id: number) {
    try {
      const country = await this.countryModel.findByPk(id, {
        include: { all: true },
      });
      if (!country) {
        throw new NotFoundException(`Country not found`);
      }
      return successMessage(country);
    } catch (error) {
      handleError(error);
    }
  }

  // UPDATE
  async update(id: number, updateCountryDto: UpdateCountryDto) {
    try {
      const [affectedRows, updatedCountries] = await this.countryModel.update(
        updateCountryDto,
        {
          where: { id },
          returning: true,
        },
      );

      if (affectedRows == 0) {
        throw new NotFoundException('Country not found');
      }
      return successMessage(updatedCountries[0]);
    } catch (error) {
      handleError(error);
    }
  }

  // REMOVE
  async remove(id: number) {
    try {
      const oldCountry = await this.countryModel.destroy({ where: { id } });
      if (oldCountry == 0) {
        throw new NotFoundException('Country not found');
      }
      return successMessage({ message: `Country  deleted successfully` });
    } catch (error) {
      handleError(error);
    }
  }
}
