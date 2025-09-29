import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Airport } from 'src/polet/airports/entities/airport.entity';
import { ClassFlight } from 'src/polet/class-flights/entities/class-flight.entity';
import { Flight } from 'src/polet/flights/entities/flight.entity';
import { FlightSchedule } from 'src/polet/flight_schedules/entities/flight_schedule.entity';

/**
 * Plane entity - Samolyotlar ma'lumotlari
 * Aeroport bilan bog'langan va reyslarni amalga oshiradi
 */

@Table({ tableName: 'planes' })
export class Plane extends Model {
  @ForeignKey(() => Airport)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare airport_id: number;

  @BelongsTo(() => Airport)
  declare airport: Airport;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare model: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare registration_number: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare economy_seats: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare business_seats: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare load: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare seat_map: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare lifting_weight: number;

  @HasMany(() => ClassFlight, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare classFlights: ClassFlight[];

  @HasMany(() => Flight, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare flights: Flight[];

  @HasMany(() => FlightSchedule, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare flightSchedules: FlightSchedule[];
}
