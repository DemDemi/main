import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { File } from '../files/file.model';

interface RefreshTokenCreationAttrs {
    user_id: number;
    refresh_token: string;
}

@Table({ tableName: 'refresh_token' })
export class Refresh_Token extends Model<Refresh_Token, RefreshTokenCreationAttrs> {

    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare user_id: number;

    @Column({ type: DataType.TEXT, allowNull: false })
    declare refresh_token: string;
}
