import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { BookingsService } from '../bookings/bookings.service';
import { FlightsService } from 'src/polet/flights/flights.service';
import { PassengersService } from '../passengers/passengers.service';
import { FlightSeatsService } from '../../polet/flight-seats/flight-seats.service';
import { ClassFlightsService } from '../../polet/class-flights/class-flights.service';
import { handleError, successMessage } from '../../helps/http-filter.response';
import { FlightSchedulesService } from '../../polet/flight_schedules/flight_schedules.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket) private readonly ticketModel: typeof Ticket,
    private readonly flightScheduleService: FlightSchedulesService,
    private readonly classFlightsService: ClassFlightsService,
    private readonly flightSeatsService: FlightSeatsService,
    private readonly passengerService: PassengersService,
    private readonly bookingsService: BookingsService,
    private readonly flightsService: FlightsService,
  ) {}

  // ✅ CREATE
  async create(createTicketDto: CreateTicketDto) {
    try {
      const {
        booking_id,
        passenger_id,
        class_id,
        flightSeat_id,
        flight_schedule_id,
        flight_id,
      } = createTicketDto;

      // Barcha obyektlarni parallel olib kelish
      const [seat, classFlight, flight, passenger, booking, flightSchedule] =
        await Promise.all([
          this.flightSeatsService.findOne(flightSeat_id),
          this.classFlightsService.findOne(class_id),
          this.flightsService.findOne(flight_id),
          this.passengerService.findOne(passenger_id),
          this.bookingsService.findOne(booking_id),
          this.flightScheduleService.findOne(flight_schedule_id),
        ]);

      // Tekshiruvlar
      if (!seat) throw new NotFoundException('Seat not found');
      if (!classFlight) throw new NotFoundException('Class flight not found');
      if (!flight) throw new NotFoundException('Flight not found');
      if (!passenger) throw new NotFoundException('Passenger not found');
      if (!booking) throw new NotFoundException('Booking not found');
      if (!flightSchedule)
        throw new NotFoundException('Flight-Schedule not found');

      const { seat_label, price } = seat.data as any;
      const { status } = booking.data as any;
      const { from, to, plan } = flight.data as any;
      const { departure_time, arrival_time } = flightSchedule.data as any;
      const {
        first_name,
        last_name,
        birth_date,
        passport_number,
        nationality,
      } = passenger.data as any;

      if (
        !seat_label ||
        !price ||
        !status ||
        !from ||
        !to ||
        !plan ||
        !passenger
      ) {
        throw new NotFoundException('Incomplete data');
      }

      const checkin_status = status === 'PAID';

      // ⛔️ 1. Oldingi ticket borligini tekshirish
      const existingTicket = await this.ticketModel.findOne({
        where: {
          booking_id,
          flightSeat_id,
          passenger_id,
        },
      });

      // ✅ 2. Agar mavjud bo‘lsa — eski ticketni qaytaramiz
      if (existingTicket) {
        return successMessage(existingTicket, 200);
      }

      // 🔁 3. Yangi ticket number generatsiyasi (unique)
      let ticket_number = this.generateTicketNumber();
      while (await this.ticketModel.findOne({ where: { ticket_number } })) {
        ticket_number = this.generateTicketNumber();
      }

      if(!checkin_status){
        throw new NotFoundException('For ticket not  PAID');
      }
      // // ✈️ 4. Yangi ticket yaratish
      const newTicket = await this.ticketModel.create({
        ticket_number,
        seat_number: seat_label,
        fare: price,
        checkin_status,
        flightPlan: plan,
        flight_details: {
          departure_time,
          arrival_time,
          departure_airport: from,
          arrival_airport: to,
        },
        passagerInfo: {
          first_name,
          last_name,
          birth_date,
          passport_number,
          nationality,
        },
        ...createTicketDto,
      });

      return successMessage(newTicket, 201);
    } catch (error) {
      return handleError(error);
    }
  }

  // Ticket number generator
  private generateTicketNumber(): string {
    const prefix = 'TKT';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}-${date}-${random}`;
  }

  // ✅ FIND ALL
  async findAll() {
    try {
      const tickets = await this.ticketModel.findAll();
      return successMessage(tickets);
    } catch (error) {
      return handleError(error);
    }
  }

  // ✅ FIND ONE
  async findOne(id: number) {
    try {
      const ticket = await this.ticketModel.findByPk(id);
      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }
      return successMessage(ticket);
    } catch (error) {
      return handleError(error);
    }
  }

  // ✅ UPDATE
  async update(id: number, updateTicketDto: UpdateTicketDto) {
    try {
      const ticket = await this.ticketModel.findByPk(id);
      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }

      await ticket.update(updateTicketDto);
      return successMessage(ticket);
    } catch (error) {
      return handleError(error);
    }
  }

  // ✅ DELETE
  async remove(id: number) {
    try {
      const ticket = await this.ticketModel.findByPk(id);
      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }

      await ticket.destroy();
      return successMessage({ message: 'Ticket deleted successfully' });
    } catch (error) {
      return handleError(error);
    }
  }
}
