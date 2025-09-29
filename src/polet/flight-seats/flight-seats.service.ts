import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlightSeatDto } from './dto/create-flight-seat.dto';
import { UpdateFlightSeatDto } from './dto/update-flight-seat.dto';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { InjectModel } from '@nestjs/sequelize';
import { FlightSeat } from './entities/flight-seat.entity';
import { ClassFlightsService } from '../class-flights/class-flights.service';
import { FlightSchedulesService } from '../flight_schedules/flight_schedules.service';
import { PassengersService } from 'src/humans/passengers/passengers.service';
@Injectable()
export class FlightSeatsService {
  constructor(
    @InjectModel(FlightSeat)
    private readonly flightSeatModel: typeof FlightSeat,
    private readonly flighrtScheduleService: FlightSchedulesService,
    private readonly classFlightService: ClassFlightsService,
    private readonly passengerService: PassengersService,
  ) {}

  async create(createFlightSeatDto: CreateFlightSeatDto) {
    try {
      const {
        schedule_id,
        class_flight_id,
        passenger_id,
        seats_col,
        seats_row,
      } = createFlightSeatDto;
      //control class_flight
      const classFlightResponse =
        await this.classFlightService.findOne(class_flight_id);

      if (!classFlightResponse) {
        throw new NotFoundException('Class flight not found');
      }

      const { code } = classFlightResponse.data as any;
      //control schedule
      const scheduleResponse =
        await this.flighrtScheduleService.findOne(schedule_id);
      if (!scheduleResponse) {
        throw new NotFoundException('Flight schedule not found');
      }

      const { base_price, seats_available } = scheduleResponse.data as any;

      let finalPrice = base_price;
      if (code === 'BUSINESS') {
        finalPrice = base_price * 2; // yoki boshqa koeffitsient
        await this.flighrtScheduleService.update(schedule_id, {
          seats_available: {
            econom_seats: seats_available.econom_seats,
            premium_seats: seats_available.premium_seats - 1,
          },
        });
      }
      if (code === 'ECONOMY') {
        await this.flighrtScheduleService.update(schedule_id, {
          seats_available: {
            econom_seats: seats_available.econom_seats - 1,
            premium_seats: seats_available.premium_seats,
          },
        });
      }
      const passengerResponse =
        await this.passengerService.findOne(passenger_id);
      if (!passengerResponse || !passengerResponse.data) {
        throw new NotFoundException('Passenger not found');
      }

      // Check if seat already exists
      const seat_label = `${seats_row}${seats_col}`;
      const existingSeat = await this.flightSeatModel.findOne({
        where: {
          seat_label,
        },
      });
      const locked = await this.flightSeatModel.findOne({
        where: {
          locked_by: passenger_id,
        },
      });

      if (locked) {
        // Passenger already has a locked seat
        throw new NotFoundException(
          `Passenger already has a locked seat: ${locked.seat_label}`,
        );
      }
      if (existingSeat) {
        const createdBy = existingSeat.lockedByPassenger
          ? `${existingSeat.lockedByPassenger.first_name} ${existingSeat.lockedByPassenger.last_name} (Passenger ID: ${existingSeat.locked_by})`
          : `User/Passenger ID: ${existingSeat.locked_by}`;

        throw new NotFoundException(
          `Seat ${seat_label} already exists for this flight. Created by: ${createdBy}`,
        );
      }

      const newSeat = await this.flightSeatModel.create({
        ...createFlightSeatDto,
        seat_label,
        price: finalPrice,
        locked_by: passenger_id,
      });
      return successMessage(newSeat, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const seats = await this.flightSeatModel.findAll({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      return successMessage(seats);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const seat = await this.flightSeatModel.findByPk(id, {
        include: { all: true },
      });

      if (!seat) {
        throw new NotFoundException('Flight seat not found');
      }

      return successMessage(seat);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateFlightSeatDto: UpdateFlightSeatDto) {
    try {
      // Check if seat exists
      const existingSeat = await this.flightSeatModel.findByPk(id);
      if (!existingSeat) {
        throw new NotFoundException('Flight seat not found');
      }

      // If class_flight_id is being updated, validate it and adjust price
      let finalPrice = (updateFlightSeatDto as any).price;
      if (updateFlightSeatDto.class_flight_id) {
        const classFlied = await this.classFlightService.findOne(
          updateFlightSeatDto.class_flight_id,
        );
        if (!classFlied) {
          throw new NotFoundException('Class flight not found');
        }

        // Adjust price if BUSINESS class and price is provided
        if ((updateFlightSeatDto as any).price) {
          const classFlightData = classFlied?.data as any;
          if (classFlightData && classFlightData.code === 'BUSINESS') {
            finalPrice = (updateFlightSeatDto as any).price * 1.5;
          }
        }
      }

      // If schedule_id is being updated, validate it
      if (updateFlightSeatDto.schedule_id) {
        const schedule = await this.flighrtScheduleService.findOne(
          updateFlightSeatDto.schedule_id,
        );
        if (!schedule) {
          throw new NotFoundException('Flight schedule not found');
        }
      }

      const [affectedRows, updatedSeats] = await this.flightSeatModel.update(
        updateFlightSeatDto,
        {
          where: { id },
          returning: true,
        },
      );

      if (affectedRows === 0) {
        throw new NotFoundException('Flight seat not found');
      }

      return successMessage(updatedSeats[0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const seat = await this.flightSeatModel.destroy({
        where: { id },
      });
      if (seat == 0) {
        throw new NotFoundException('Flight seat not found');
      }

      return successMessage({ message: 'Flight seat deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
