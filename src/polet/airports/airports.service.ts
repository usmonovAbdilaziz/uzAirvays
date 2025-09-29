import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Airport } from './entities/airport.entity';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class AirportsService {
  constructor(
    @InjectModel(Airport) private readonly airportModel: typeof Airport,
    private readonly companyService: CompaniesService,
  ) {}
  async create(createAirportDto: CreateAirportDto) {
    try {
      const { company_id, name, iata_code, icao_code } = createAirportDto;

      // Check if city exists
      const city = await this.companyService.findOne(company_id);
      if (!city) {
        throw new NotFoundException('City not found');
      }

      // Check if airport name already exists in the same city
      const existingName = await this.airportModel.findOne({
        where: {
          name,
          company_id,
        },
      });

      if (existingName) {
        throw new ConflictException(
          'Airport with this name already exists in this city',
        );
      }

      // Check if IATA code already exists
      const existingIata = await this.airportModel.findOne({
        where: { iata_code },
        order: [['id', 'DESC']],
      });
      if (existingIata) {
        throw new ConflictException(
          'Airport with this IATA code already exists',
        );
      }

      // Check if ICAO code already exists
      const existingIcao = await this.airportModel.findOne({
        where: { icao_code },
      });
      if (existingIcao) {
        throw new ConflictException(
          'Airport with this ICAO code already exists',
        );
      }

      const newAirport = await this.airportModel.create({
        ...createAirportDto,
      });
      return successMessage(newAirport, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const airports = await this.airportModel.findAll({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      return successMessage(airports);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const airport = await this.airportModel.findByPk(id, {
        include: { all: true },
      });

      if (!airport) {
        throw new NotFoundException('Airport not found');
      }
      return successMessage(airport);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateAirportDto: UpdateAirportDto) {
    try {
      const [affectedRows, updatedAirports] = await this.airportModel.update(
        updateAirportDto,
        { where: { id }, returning: true },
      );
      if (affectedRows == 0) {
        throw new NotFoundException('Airport not found');
      }

      return successMessage(updatedAirports[0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const airport = await this.airportModel.destroy({ where: { id } });
      if (airport == 0) {
        throw new NotFoundException('Airport not found');
      }
      return successMessage({ message: 'Airport deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
