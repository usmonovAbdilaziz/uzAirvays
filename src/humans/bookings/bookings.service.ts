import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { handleError, successMessage } from 'src/helps/http-filter.response';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './entities/booking.entity';
import { UsersService } from 'src/users/users.service';
import { FlightSchedulesService } from 'src/polet/flight_schedules/flight_schedules.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking) private readonly bookingModel: typeof Booking,
    private readonly flightScheduleService: FlightSchedulesService,
    private readonly userService: UsersService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    try {
      const { user_id, flight_schedule_id } = createBookingDto;

      // Verify user exists
      const user = await this.userService.findOne(user_id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // Verify flight schedule exists
      const flightSchedule =
        await this.flightScheduleService.findOne(flight_schedule_id);
      if (!flightSchedule) {
        throw new NotFoundException('Flight schedule not found');
      }
      const { base_price } = flightSchedule.data as any;

      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let reference = '';
      for (let i = 0; i < 6; i++) {
        reference += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const newBooking = await this.bookingModel.create({
        ...createBookingDto,
        total_amount: base_price,
        booking_reference: reference,
      });
      return successMessage(newBooking, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const bookings = await this.bookingModel.findAll({
        include: { all: true },
        order: [['id', 'DESC']],
      });
      return successMessage(bookings);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const booking = await this.bookingModel.findByPk(id, {
        include: { all: true },
      });
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      return successMessage(booking);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    try {
      // First check if booking exists
      const existingBooking = await this.bookingModel.findByPk(id);
      if (!existingBooking) {
        throw new NotFoundException('Booking not found');
      }

      const { user_id, flight_schedule_id } = updateBookingDto;
      let updateData: UpdateBookingDto & { total_amount?: number } = {
        ...updateBookingDto,
      };

      // Verify user exists if user_id is being updated
      if (user_id && user_id !== existingBooking.user_id) {
        const user = await this.userService.findOne(user_id);
        if (!user) {
          throw new NotFoundException('User not found');
        }
      }

      // Verify flight schedule exists and recalculate total_amount if flight_schedule_id is being updated
      if (
        flight_schedule_id &&
        flight_schedule_id !== existingBooking.flight_schedule_id
      ) {
        const flightSchedule =
          await this.flightScheduleService.findOne(flight_schedule_id);
        if (!flightSchedule) {
          throw new NotFoundException('Flight schedule not found');
        }
        const { base_price } = flightSchedule.data as any;
        updateData.total_amount = base_price;
      }

      const [affectedRows, updatedBookings] = await this.bookingModel.update(
        updateData,
        {
          where: { id },
          returning: true,
        },
      );

      if (affectedRows === 0) {
        throw new NotFoundException('Booking not found');
      }

      return successMessage(updatedBookings[0]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const oldBooking = await this.bookingModel.destroy({ where: { id } });
      if (oldBooking == 0) {
        throw new NotFoundException('Booking not found');
      }
      return successMessage({ message: 'Delete booking from id' });
    } catch (error) {
      handleError(error);
    }
  }
}
