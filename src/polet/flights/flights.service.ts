import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Flight } from './entities/flight.entity';
import { CompaniesService } from '../companies/companies.service';
import { AirportsService } from '../airports/airports.service';
import { PlanesService } from '../planes/planes.service';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { FlightStatus } from 'src/Roles/roles';

@Injectable()
export class FlightsService {
  constructor(
    @InjectModel(Flight) private readonly flightModel: typeof Flight,
    private readonly companiesService: CompaniesService,
    private readonly airportsService: AirportsService,
    private readonly planesService: PlanesService,
  ) {}

  async create(createFlightDto: CreateFlightDto) {
    try {
      const {
        plan,
        company_id,
        flight_number,
        origin_airport_id,
        destination_airport_id,
        plane_id,
      } = createFlightDto;

      // Check if company exists
      const company = await this.companiesService.findOne(company_id);
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      // Check if plane exists
      const plane = await this.planesService.findOne(plane_id);
      if (!plane) {
        throw new NotFoundException('Plane not found');
      }

      // Check if origin airport exists
      const originAirport =
        await this.airportsService.findOne(origin_airport_id);
      if (!originAirport) {
        throw new NotFoundException('Origin airport not found');
      }

      // Check if destination airport exists
      const destinationAirport = await this.airportsService.findOne(
        destination_airport_id,
      );
      if (!destinationAirport) {
        throw new NotFoundException('Destination airport not found');
      }

      // Check if origin and destination are different
      if (origin_airport_id === destination_airport_id) {
        throw new ConflictException(
          'Origin and destination airports cannot be the same',
        );
      }

      // Check if flight number already exists
      const existingFlight = await this.flightModel.findOne({
        where: { flight_number },
      });
      const existingPlan = await this.flightModel.findOne({
        where: { plan },
      });
      if (existingPlan && existingFlight) {
        throw new ConflictException('Flight with this plan already exists');
      }
      const origin = originAirport.data as any;
      const destination = destinationAirport.data as any;

      const newFlight = await this.flightModel.create({
        ...createFlightDto,
        from: { name: origin.name, code: origin.iata_code },
        to: { name: destination.name, code: destination.iata_code },
      });
      return successMessage(newFlight, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const flights = await this.flightModel.findAll({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      return successMessage(flights);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const flight = await this.flightModel.findByPk(id, {
        include: { all: true },
      });
      if (!flight) {
        throw new NotFoundException('Flight not found');
      }
      return successMessage(flight);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateFlightDto: UpdateFlightDto) {
    try {
      // Check if flight exists
      const existingFlight = await this.flightModel.findByPk(id);
      if (!existingFlight) {
        throw new NotFoundException('Flight not found');
      }

      // If company_id is being updated, check if company exists
      if (updateFlightDto.company_id) {
        const company = await this.companiesService.findOne(
          updateFlightDto.company_id,
        );
        if (!company) {
          throw new NotFoundException('Company not found');
        }
      }

      // If plane_id is being updated, check if plane exists
      if (updateFlightDto.plane_id) {
        const plane = await this.planesService.findOne(
          updateFlightDto.plane_id,
        );
        if (!plane) {
          throw new NotFoundException('Plane not found');
        }
      }

      // If origin_airport_id is being updated, check if airport exists
      if (updateFlightDto.origin_airport_id) {
        const originAirport = await this.airportsService.findOne(
          updateFlightDto.origin_airport_id,
        );
        if (!originAirport) {
          throw new NotFoundException('Origin airport not found');
        }
      }

      // If destination_airport_id is being updated, check if airport exists
      if (updateFlightDto.destination_airport_id) {
        const destinationAirport = await this.airportsService.findOne(
          updateFlightDto.destination_airport_id,
        );
        if (!destinationAirport) {
          throw new NotFoundException('Destination airport not found');
        }
      }

      // Check if origin and destination are different (if both are provided)
      const newOriginId =
        updateFlightDto.origin_airport_id || existingFlight.origin_airport_id;
      const newDestinationId =
        updateFlightDto.destination_airport_id ||
        existingFlight.destination_airport_id;
      if (newOriginId === newDestinationId) {
        throw new ConflictException(
          'Origin and destination airports cannot be the same',
        );
      }

      // If flight number is being updated, check for uniqueness
      if (updateFlightDto.flight_number) {
        const existingFlightNumber = await this.flightModel.findOne({
          where: {
            flight_number: updateFlightDto.flight_number,
            id: { [require('sequelize').Op.ne]: id },
          },
        });
        if (existingFlightNumber) {
          throw new ConflictException(
            'Flight with this flight number already exists',
          );
        }
      }

      const [affectedRows, updatedFlights] = await this.flightModel.update(
        updateFlightDto,
        {
          where: { id },
          returning: true,
        },
      );

      if (affectedRows === 0) {
        throw new NotFoundException('Flight not found');
      }

      return successMessage(updatedFlights[0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const flight = await this.flightModel.destroy({ where: { id } });
      if (flight === 0) {
        throw new NotFoundException('Flight not found');
      }
      return successMessage({ message: 'Flight deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
