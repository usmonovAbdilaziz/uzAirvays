import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Booking } from '../../bookings/entities/booking.entity';
import { BookingPassenger } from 'src/humans/bookings-passengers/entities/bookings-passenger.entity';
import { Ticket } from 'src/humans/tickets/entities/ticket.entity';
import { FlightSeat } from 'src/polet/flight-seats/entities/flight-seat.entity';

/**
 * Passenger entity - Yo'lovchilar ma'lumotlari
 * Booking bilan many-to-many bog'lanishga ega
 */

@Table({ tableName: 'passengers' })
export class Passenger extends Model {
  @BelongsToMany(() => Booking, () => BookingPassenger)
  declare bookings: Booking[];

  @HasMany(() => Ticket, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare tickets: Ticket[];

  @HasMany(() => FlightSeat, {
    foreignKey: 'locked_by',
  })
  declare lockedSeats: FlightSeat[];

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare first_name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare last_name: string;

  @Column({
    allowNull: false,
    type: DataType.DATEONLY,
  })
  declare birth_date: Date;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare passport_number: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare nationality: string;

  @Column({
    type: DataType.STRING,
  })
  declare note?: string;
}
