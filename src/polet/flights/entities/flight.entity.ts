import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Company } from '../../companies/entities/company.entity';
import { Airport } from '../../airports/entities/airport.entity';
import { Plane } from '../../planes/entities/plane.entity';
import { FlightStatus } from '../../../Roles/roles';
import { FlightSchedule } from '../../flight_schedules/entities/flight_schedule.entity';

/**
 * Flight entity - Reyslar ma'lumotlari
 * Kompaniya, aeroport va samolyot bilan bog'langan
 */

@Table({ tableName: 'flights' })
export class Flight extends Model {
  @ForeignKey(() => Company)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare company_id: number;

  @BelongsTo(() => Company)
  declare company: Company;

  @ForeignKey(() => Airport)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare origin_airport_id: number;

  @BelongsTo(() => Airport, {
    foreignKey: 'origin_airport_id',
    as: 'originAirport',
  })
  declare originAirport: Airport;

  @ForeignKey(() => Airport)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare destination_airport_id: number;

  @BelongsTo(() => Airport, {
    foreignKey: 'destination_airport_id',
    as: 'destinationAirport',
  })
  declare destinationAirport: Airport;

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
    type: DataType.ENUM(...Object.values(FlightStatus)),
    defaultValue: FlightStatus.SCHEDULED,
  })
  declare status: FlightStatus;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare duration_minutes: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare flight_number: string;

  @Column({
    allowNull: false,
    type: DataType.JSON, // <-- JSON format
  })
  declare from: {
    name: string;
    code: string;
  };

  @Column({
    allowNull: false,
    type: DataType.JSON,
  })
  declare to: {
    name: string;
    code: string;
  };

  @Column({
    allowNull: false,
    type: DataType.DATEONLY,
  })
  declare plan: Date;

  @HasMany(() => FlightSchedule, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare schedules: FlightSchedule[];
}
