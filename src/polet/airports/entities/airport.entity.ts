import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Company } from 'src/polet/companies/entities/company.entity';
import { City } from 'src/polet/cities/entities/city.entity';
import { Plane } from 'src/polet/planes/entities/plane.entity';
import { Flight } from 'src/polet/flights/entities/flight.entity';

/**
 * Airport entity - Havo portlari ma'lumotlari
 * Shahar va kompaniya bilan bog'langan
 */

@Table({ tableName: 'airports' })
export class Airport extends Model {
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare iata_code: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare icao_code: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare name: string;

  @ForeignKey(() => City)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare city_id: number;

  @BelongsTo(() => City)
  declare city: City;

  @ForeignKey(() => Company)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare company_id: number;

  @BelongsTo(() => Company)
  declare company: Company;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare timezone: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare latitude: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare longitude: number;

  @HasMany(() => Plane, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare planes: Plane[];

  @HasMany(() => Flight, {
    foreignKey: 'origin_airport_id',
    as: 'originFlights',
  })
  declare originFlights: Flight[];

  @HasMany(() => Flight, {
    foreignKey: 'destination_airport_id',
    as: 'destinationFlights',
  })
  declare destinationFlights: Flight[];
}
