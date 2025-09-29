import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlightScheduleDto } from './dto/create-flight_schedule.dto';
import { UpdateFlightScheduleDto } from './dto/update-flight_schedule.dto';
import { InjectModel } from '@nestjs/sequelize';
import { FlightSchedule } from './entities/flight_schedule.entity';
import { FlightsService } from '../flights/flights.service';
import { PlanesService } from '../planes/planes.service';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { Op } from 'sequelize';

@Injectable()
export class FlightSchedulesService {
  constructor(
    @InjectModel(FlightSchedule)
    private readonly flightScheduleModel: typeof FlightSchedule,
    private readonly flightService: FlightsService,
    private readonly planeService: PlanesService,
  ) {}
  async create(createFlightScheduleDto: CreateFlightScheduleDto) {
    try {
      const { flight_id, plane_id, departure_time, arrival_time } =
        createFlightScheduleDto;

      // Verify flight exists
      const flight = await this.flightService.findOne(flight_id);
      if (!flight) {
        throw new NotFoundException('Flight not found');
      }

      // Verify plane exists
      const plane = await this.planeService.findOne(plane_id);
      if (!plane) {
        throw new NotFoundException('Plane not found');
      }

      // Check if plane is already scheduled for this time period
      const existingSchedule = await this.flightScheduleModel.findOne({
        where: { plane_id },
      });

      if (existingSchedule) {
        throw new ConflictException(
          'Plane is already scheduled for this time period',
        );
      }

      // Validate departure time is before arrival time
      if (new Date(departure_time) >= new Date(arrival_time)) {
        throw new ConflictException(
          'Departure time must be before arrival time',
        );
      }
      const planeData = plane.data as {
        econom_seats: number;
        premium_seats: number;
        [key: string]: any;
      };
      const { econom_seats, premium_seats } = planeData;

      // Calculate total seats
      const seatsTotal = { econom_seats, premium_seats };
      const seatsAvailable = { econom_seats, premium_seats }; // Initially all seats are available

      const newFlightSchedule = await this.flightScheduleModel.create({
        flight_id,
        plane_id,
        departure_time,
        arrival_time,
        base_price: createFlightScheduleDto.base_price,
        status: createFlightScheduleDto.status,
        seats_total: seatsTotal,
        seats_available: seatsAvailable,
      });

      return successMessage(newFlightSchedule, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const flightSchedules = await this.flightScheduleModel.findAll({
        include: { all: true },
        order: [['departure_time', 'ASC']],
      });

      return successMessage(flightSchedules);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const flightSchedule = await this.flightScheduleModel.findByPk(id, {
        include: { all: true },
      });

      if (!flightSchedule) {
        throw new NotFoundException('Flight schedule not found');
      }

      return successMessage(flightSchedule);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateFlightScheduleDto: UpdateFlightScheduleDto) {
    try {
      // Check if flight schedule exists
      const existingSchedule = await this.flightScheduleModel.findByPk(id);
      if (!existingSchedule) {
        throw new NotFoundException('Flight schedule not found');
      }

      const { flight_id, plane_id } = updateFlightScheduleDto;

      // Verify flight exists if flight_id is being updated
      if (flight_id && flight_id !== existingSchedule.flight_id) {
        const flight = await this.flightService.findOne(flight_id);
        if (!flight) {
          throw new NotFoundException('Flight not found');
        }
      }

      // Verify plane exists if plane_id is being updated
      if (plane_id && plane_id !== existingSchedule.plane_id) {
        const plane = await this.planeService.findOne(plane_id);
        if (!plane) {
          throw new NotFoundException('Plane not found');
        }
      }
      const [affectedRows, updatedSchedules] =
        await this.flightScheduleModel.update(updateFlightScheduleDto, {
          where: { id },
          returning: true,
        });

      if (affectedRows === 0) {
        throw new NotFoundException('Flight schedule not found');
      }

      return successMessage(updatedSchedules[0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      // Check if flight schedule exists
      const existingSchedule = await this.flightScheduleModel.findByPk(id);
      if (!existingSchedule) {
        throw new NotFoundException('Flight schedule not found');
      }

      const deletedCount = await this.flightScheduleModel.destroy({
        where: { id },
      });

      if (deletedCount === 0) {
        throw new NotFoundException('Flight schedule not found');
      }

      return successMessage({
        message: 'Flight schedule deleted successfully',
      });
    } catch (error) {
      handleError(error);
    }
  }

  // Additional useful methods
  async findByStatus(
    status: 'scheduled' | 'delayed' | 'cancelled' | 'completed',
  ) {
    try {
      const flightSchedules = await this.flightScheduleModel.findAll({
        where: { status },
        include: [
          {
            association: 'flight',
            include: [
              { association: 'company' },
              { association: 'originAirport' },
              { association: 'destinationAirport' },
            ],
          },
          {
            association: 'plane',
            include: [{ association: 'company' }],
          },
        ],
        order: [['departure_time', 'ASC']],
      });

      return successMessage(flightSchedules);
    } catch (error) {
      handleError(error);
    }
  }

  async findByDateRange(startDate: string, endDate: string) {
    try {
      const flightSchedules = await this.flightScheduleModel.findAll({
        where: {
          departure_time: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            association: 'flight',
            include: [
              { association: 'company' },
              { association: 'originAirport' },
              { association: 'destinationAirport' },
            ],
          },
          {
            association: 'plane',
            include: [{ association: 'company' }],
          },
        ],
        order: [['departure_time', 'ASC']],
      });

      return successMessage(flightSchedules);
    } catch (error) {
      handleError(error);
    }
  }

  async updateSeatsAvailable(id: number, seatsToBook: number) {
    try {
      const schedule = await this.flightScheduleModel.findByPk(id);
      if (!schedule) {
        throw new NotFoundException('Flight schedule not found');
      }

      // Cast seats_available to the expected structure
      const seatsAvailable = schedule.seats_available as any;
      const totalAvailableSeats =
        seatsAvailable.econom_seats + seatsAvailable.premium_seats;

      if (totalAvailableSeats < seatsToBook) {
        throw new ConflictException('Not enough seats available');
      }

      // For simplicity, deduct from economy seats first, then premium
      let updatedEconomSeats = seatsAvailable.econom_seats;
      let updatedPremiumSeats = seatsAvailable.premium_seats;
      let remainingToBook = seatsToBook;

      if (remainingToBook > 0 && updatedEconomSeats > 0) {
        const economSeatsToBook = Math.min(remainingToBook, updatedEconomSeats);
        updatedEconomSeats -= economSeatsToBook;
        remainingToBook -= economSeatsToBook;
      }

      if (remainingToBook > 0 && updatedPremiumSeats > 0) {
        const premiumSeatsToBook = Math.min(
          remainingToBook,
          updatedPremiumSeats,
        );
        updatedPremiumSeats -= premiumSeatsToBook;
        remainingToBook -= premiumSeatsToBook;
      }

      const newSeatsAvailable = {
        econom_seats: updatedEconomSeats,
        premium_seats: updatedPremiumSeats,
      };

      const [affectedRows, updatedSchedules] =
        await this.flightScheduleModel.update(
          {
            seats_available: newSeatsAvailable,
          },
          {
            where: { id },
            returning: true,
          },
        );

      return successMessage(updatedSchedules[0]);
    } catch (error) {
      handleError(error);
    }
  }
}
