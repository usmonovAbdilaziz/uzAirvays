import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Booking } from 'src/humans/bookings/entities/booking.entity';
import { Passenger } from 'src/humans/passengers/entities/passenger.entity';

@Table({ tableName: 'booking_passengers' })
export class BookingPassenger extends Model {
  @ForeignKey(() => Booking)
  @Column({ type: DataType.INTEGER })
  booking_id: number;

  @ForeignKey(() => Passenger)
  @Column({ type: DataType.INTEGER })
  passenger_id: number;
}
