import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User)
        private User_Repo: typeof User,
    ) { }

    async create(dto: CreateUserDto) {
        const user = await this.User_Repo.create(dto)
        return user
    }

    async get_by_login(login: string) {
        const user = await this.User_Repo.findOne({ where: { login } })
        return user
    }

    async get_by_id(id: number) {
        const user = await this.User_Repo.findByPk(id)
        return user
    }

}
