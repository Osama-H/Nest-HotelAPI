import {
  Table,
  Column,
  Model,
  ForeignKey,
  HasOne,
  HasMany,
  BelongsToMany,
  Index,
  DataType,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';

@Table
export class Role extends Model {
  @Index
  @Column({
    type: DataType.STRING,
    set(value: string) {
      this.setDataValue('name', value.toLowerCase());
    },
  })
  name: string;

  @HasMany(() => User)
  users: User[];
}
