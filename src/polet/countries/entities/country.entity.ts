import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { City } from 'src/polet/cities/entities/city.entity';

/**
 * Country entity - Mamlakatlar ma'lumotlari
 * Shaharlar bilan bog'langan
 */

@Table({ tableName: 'countries' })
export class Country extends Model {
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare iso_code: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: string;

  @HasMany(() => City, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare cities: City[];
}
