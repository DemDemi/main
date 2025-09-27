import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/users/user.model';


interface FileCreationAttrs {
  name: string;
  path_name: string
  extension: string;
  mime_type: string;
  size: number;
  uploaded_at: Date;
  user_id?: number;
}

@Table({ tableName: 'files', createdAt: true, updatedAt: true })
export class File extends Model<File, FileCreationAttrs> {

  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare path_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare extension: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare mime_type: string;

  @Column({ type: DataType.BIGINT, allowNull: false })
  declare size: number;

  @Column({ type: DataType.DATE, allowNull: false })
  declare uploaded_at: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  declare upload_by: User;
}
