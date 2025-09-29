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
import { City } from 'src/polet/cities/entities/city.entity';
import { Flight } from 'src/polet/flights/entities/flight.entity';

/**
 * Company entity - Aviakompaniyalar ma'lumotlari
 * Shahar bilan bog'langan va reyslar, aeroportlarni boshqaradi
 */

@Table({ tableName: 'companies' })
export class Company extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare website: string;

  @ForeignKey(() => City)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare city_id: number;

  @BelongsTo(() => City)
  declare city: City;

  @HasMany(() => Airport, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare airports: Airport[];

  @HasMany(() => Flight, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare flights: Flight[];
}
