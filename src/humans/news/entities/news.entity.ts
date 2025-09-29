import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../../users/entities/user.entity';

/**
 * News entity - Yangiliklar ma'lumotlari
 * Foydalanuvchi tomonidan yaratilgan yangiliklar
 */

@Table({ tableName: 'news' })
export class News extends Model {
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare title: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare content: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  declare image_url: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_published: boolean;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;
}
