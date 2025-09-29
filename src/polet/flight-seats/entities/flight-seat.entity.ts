import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { FlightSchedule } from '../../flight_schedules/entities/flight_schedule.entity';
import { ClassFlight } from '../../class-flights/entities/class-flight.entity';
import { Passenger } from '../../../humans/passengers/entities/passenger.entity';
import { SeatCol } from 'src/Roles/roles';

@Table({ tableName: 'flight_seats' })
export class FlightSeat extends Model {
  @ForeignKey(() => FlightSchedule)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare schedule_id: number;

  @BelongsTo(() => FlightSchedule)
  declare schedule: FlightSchedule;

  @ForeignKey(() => ClassFlight)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare class_flight_id: number;

  @BelongsTo(() => ClassFlight)
  declare classFlight: ClassFlight;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare seat_label: string;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
  })
  declare price: number;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_serviced: boolean;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  declare reserved_until: Date;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare seats_row: number;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(SeatCol)),
  })
  declare seats_col: SeatCol;

  @ForeignKey(() => Passenger)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  declare locked_by: number;

  @BelongsTo(() => Passenger)
  declare lockedByPassenger: Passenger;
}
