import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { BookingStatus, Currency } from '../../../Roles/roles';
import { User } from '../../../users/entities/user.entity';
import { Passenger } from '../../../humans/passengers/entities/passenger.entity';
import { FlightSchedule } from '../../../polet/flight_schedules/entities/flight_schedule.entity';
import { BookingPassenger } from '../../../humans/bookings-passengers/entities/bookings-passenger.entity';
import { Payment } from '../../../payments/entities/payment.entity';
import { Ticket } from '../../../humans/tickets/entities/ticket.entity';

/**
 * Booking entity - Bronlar ma'lumotlari
 * User, FlightSchedule, Passenger va Payment bilan bog'langan
 */

@Table({ tableName: 'bookings' })
export class Booking extends Model {
  @Column({
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
  })
  declare total_amount: number;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(Currency)),
    defaultValue: Currency.USD,
  })
  declare currency: Currency;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(BookingStatus)),
    defaultValue: BookingStatus.PENDING,
  })
  declare status: BookingStatus;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  declare note: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  declare booking_reference: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => FlightSchedule)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare flight_schedule_id: number;

  @BelongsTo(() => FlightSchedule)
  declare flight_schedule: FlightSchedule;

  @BelongsToMany(() => Passenger, () => BookingPassenger)
  declare passengers: Passenger[];

  @HasMany(() => Payment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare payments: Payment[];

  @HasMany(() => Ticket, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare tickets: Ticket[];
}
