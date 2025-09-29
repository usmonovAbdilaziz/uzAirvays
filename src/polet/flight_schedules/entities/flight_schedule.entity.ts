import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Flight } from '../../flights/entities/flight.entity';
import { Plane } from '../../planes/entities/plane.entity';
import { ScheduleStatus } from 'src/Roles/roles';
import { Booking } from 'src/humans/bookings/entities/booking.entity';

@Table({ tableName: 'flight_schedules' })
export class FlightSchedule extends Model {
  @ForeignKey(() => Flight)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare flight_id: number;

  @BelongsTo(() => Flight)
  declare flight: Flight;

  @ForeignKey(() => Plane)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare plane_id: number;

  @BelongsTo(() => Plane)
  declare plane: Plane;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare departure_time: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare arrival_time: Date;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(ScheduleStatus)),
    defaultValue: ScheduleStatus.SCHEDULED,
  })
  declare status: ScheduleStatus;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
  })
  declare base_price: number;

  @Column({
    allowNull: false,
    type: DataType.JSONB,
  })
  declare seats_total: JSON;

  @Column({
    allowNull: false,
    type: DataType.JSONB,
  })
  declare seats_available: JSON;

  @HasMany(() => Booking, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare bookings: Booking[];
}
