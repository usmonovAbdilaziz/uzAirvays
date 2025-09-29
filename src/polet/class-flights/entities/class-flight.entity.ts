import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Plane } from 'src/polet/planes/entities/plane.entity';
import { Flight } from 'src/polet/flights/entities/flight.entity';
import { ClassFlightRole } from 'src/Roles/roles';
import { FlightSeat } from 'src/polet/flight-seats/entities/flight-seat.entity';
import { Ticket } from 'src/humans/tickets/entities/ticket.entity';
import { Passenger } from 'src/humans/passengers/entities/passenger.entity';

/**
 * ClassFlight entity - Parvoz sinflari ma'lumotlari
 * Samolyot bilan bog'langan va turli xil xizmat sinflarini belgilaydi
 */

@Table({ tableName: 'class_flights' })
export class ClassFlight extends Model {
  //code class-flicght role
  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(ClassFlightRole)),
  })
  declare code: ClassFlightRole;

  // display name
  @Column({ allowNull: false, type: DataType.STRING })
  declare display_name: string;

  // legroom
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare legroom: number;

  // baggage allowance in kg
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare baggage_allowance_kg: number;

  // plane connection
  @ForeignKey(() => Plane)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare plane_id: number;

  @BelongsTo(() => Plane)
  declare plane: Plane;

  @ForeignKey(() => Passenger)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare passenger_id: number;

  @BelongsTo(() => Passenger)
  declare passenger: Passenger;

  @HasMany(() => FlightSeat, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare flightSeats: FlightSeat[];

  @HasMany(() => Ticket, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare tickets: Ticket[];
}
