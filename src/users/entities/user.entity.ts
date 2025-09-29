import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Booking } from '../../humans/bookings/entities/booking.entity';
import { News } from '../../humans/news/entities/news.entity';
import { AdminRole } from '../../Roles/roles';
import { LoyaltyProgram } from 'src/humans/loyalty_programs/entities/loyalty_program.entity';

/**
 * User entity - Foydalanuvchilar ma'lumotlari
 * Booking va News bilan bog'langan
 */

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare full_name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare password: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(AdminRole)),
    defaultValue: AdminRole.USER,
  })
  declare role: AdminRole;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare loyality_points: number;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare is_active: boolean;

  @HasMany(() => LoyaltyProgram, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare loyalty: LoyaltyProgram[];

  @HasMany(() => News, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare news: News[];

  @HasMany(() => Booking, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare bookings: Booking[];
}
