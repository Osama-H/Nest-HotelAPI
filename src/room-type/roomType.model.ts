import { Table, Column, Model, HasMany, Index } from 'sequelize-typescript';
import { Room } from 'src/room/room.model';

@Table
export class RoomType extends Model {
  @Index
  @Column
  name: string;

  @Column
  description: string;

  @HasMany(() => Room)
  rooms: Room[];
}
