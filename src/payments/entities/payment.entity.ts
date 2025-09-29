import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Booking } from '../../humans/bookings/entities/booking.entity';
import { BookingStatus, Currency } from '../../Roles/roles';

/**
 * Payment entity - To'lovlar ma'lumotlari
 * Booking bilan bog'langan to'lov ma'lumotlari
 */

@Table({ tableName: 'payments' })
export class Payment extends Model {
  @ForeignKey(() => Booking)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare booking_id: number;

  @BelongsTo(() => Booking)
  declare booking: Booking;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare provider: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare provider_transaction_id: string;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
  })
  declare amount: number;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(BookingStatus)),
  })
  declare status: BookingStatus;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(Currency)),
  })
  declare currency: Currency;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare metadata: object;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare stripe_payment_intent_id: string;
}
