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
import { Country } from 'src/polet/countries/entities/country.entity';
import { Airport } from 'src/polet/airports/entities/airport.entity';

/**
 * City entity - Shaharlar ma'lumotlari
 * Mamlakat bilan bog'langan va kompaniyalar, aeroportlarni o'z ichiga oladi
 */

@Table({ tableName: 'cities' })
export class City extends Model {
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: string;

  @ForeignKey(() => Country)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare country_id: number;

  @BelongsTo(() => Country)
  declare country: Country;

  @HasMany(() => Company, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare companies: Company[];

  @HasMany(() => Airport, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare airports: Airport[];
}
