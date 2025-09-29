import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../../users/entities/user.entity';

/**
 * LoyaltyProgram entity - Sadoqat dasturlari ma'lumotlari
 * Foydalanuvchilar uchun mukofot tizimi
 */

@Table({ tableName: 'loyalty_programs' })
export class LoyaltyProgram extends Model {
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare description: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: UserVerificationRequirement;
}
