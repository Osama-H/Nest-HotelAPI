import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';

import { Hotel } from 'src/hotel/models/hotel.model';

@Table
export class ContactInfo extends Model {
  @Column
  email: string;

  @Column
  telephone: number;

  @Column
  fax: string;

  @ForeignKey(() => Hotel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hotelId: number;
}
