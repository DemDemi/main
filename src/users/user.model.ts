import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { File } from '../files/file.model';

interface UserCreationAttrs {
    login: string;
    password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {

    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    declare login: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare password: string;

    @Column({ type: DataType.STRING, allowNull: true }) 
    declare phone: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare name: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare surname: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    declare banned: boolean;

    @HasMany(() => File)
    declare files: File[];
}
