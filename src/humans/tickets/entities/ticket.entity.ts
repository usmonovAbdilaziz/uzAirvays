import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Booking } from '../../../humans/bookings/entities/booking.entity';
import { Passenger } from '../../../humans/passengers/entities/passenger.entity';
import { ClassFlight } from '../../../polet/class-flights/entities/class-flight.entity';
import { FlightSeat } from '../../../polet/flight-seats/entities/flight-seat.entity';
import { FlightSchedule } from '../../../polet/flight_schedules/entities/flight_schedule.entity';
import { Flight } from 'src/polet/flights/entities/flight.entity';

/**
 * Ticket entity - Chipta ma'lumotlari
 * Booking, Passenger, Flight va o'rindiq bilan bog'langan
 */

@Table({ tableName: 'tickets' })
export class Ticket extends Model {
  //booking
  @ForeignKey(() => Booking)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare booking_id: number;

  @BelongsTo(() => Booking)
  declare booking: Booking;

  @ForeignKey(() => Passenger)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare passenger_id: number;

  @BelongsTo(() => Passenger)
  declare passenger: Passenger;

  @ForeignKey(() => FlightSchedule)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare flight_schedule_id: number;

  @BelongsTo(() => FlightSchedule)
  declare flightSchedule: FlightSchedule;

  @ForeignKey(() => FlightSeat)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare flightSeat_id: number;

  @BelongsTo(() => FlightSeat)
  declare flightSeat: FlightSeat;

  @ForeignKey(() => ClassFlight)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare class_id: number;

  @BelongsTo(() => ClassFlight)
  declare classFlight: ClassFlight;

  @ForeignKey(() => Flight)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare flight_id: number;

  @BelongsTo(() => Flight)
  declare flights: Flight;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare ticket_number: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare seat_number: string;

  @Column({
    allowNull: false,
    type: DataType.JSONB,
  })
  declare passagerInfo: {
    first_name: string;
    last_name: string;
    passport_number: string;
    nationality: string;
    birth_date: Date;
  };

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
  })
  declare fare: number;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare checkin_status: boolean;

  @Column({
    allowNull: false,
    type: DataType.JSONB,
  })
  declare flight_details: {
    departure_time: Date;
    arrival_time: Date;
    departure_airport: string;
    arrival_airport: string;
  };
}
