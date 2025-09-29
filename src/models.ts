import { User } from './users/entities/user.entity';
import { LoyaltyProgram } from './humans/loyalty_programs/entities/loyalty_program.entity';
import { News } from './humans/news/entities/news.entity';
import { Booking } from './humans/bookings/entities/booking.entity';
import { Passenger } from './humans/passengers/entities/passenger.entity';
import { Payment } from './payments/entities/payment.entity';
import { Country } from './polet/countries/entities/country.entity';
import { City } from './polet/cities/entities/city.entity';
import { Company } from './polet/companies/entities/company.entity';
import { Plane } from './polet/planes/entities/plane.entity';
import { Airport } from './polet/airports/entities/airport.entity';
import { Flight } from './polet/flights/entities/flight.entity';
import { ClassFlight } from './polet/class-flights/entities/class-flight.entity';
import { FlightSchedule } from './polet/flight_schedules/entities/flight_schedule.entity';
import { FlightSeat } from './polet/flight-seats/entities/flight-seat.entity';
import { BookingPassenger } from './humans/bookings-passengers/entities/bookings-passenger.entity';
import { Ticket } from './humans/tickets/entities/ticket.entity';

export const MODELS = [
  User,
  LoyaltyProgram,
  News,
  Booking,
  Passenger,
  Payment,
  Country,
  City,
  Company,
  Plane,
  Airport,
  Flight,
  ClassFlight,
  FlightSchedule,
  FlightSeat,
  BookingPassenger,
  Ticket,
];
