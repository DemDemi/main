import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as uuid from 'uuid';
import * as bcrypt from 'bcryptjs'
import { RegisterUserDto } from './dto/register-user.dto';
import { Response } from 'express';
import { Refresh_Token } from './user-refresh_token.model';
import { InjectModel } from '@nestjs/sequelize';

export const REFRESH_TOKEN_NAME = 'refresh_token';

@Injectable()
export class AuthService {

    EXPIRE_DAY_REFRESH_TOKEN = 30


    constructor(
        private User_Service: UsersService,
        private Jwt_Service: JwtService,

        @InjectModel(Refresh_Token)
        private Refresh_Token_Repo: typeof Refresh_Token,
    ) { }



    async login(dto: LoginUserDto) {

        const user = await this.validate_user(dto)
        const tokens = await this.generate_tokens(user)
        await this.Refresh_Token_Repo.create({user_id: user.id, refresh_token: tokens.refresh_token})
        return {
            user,
            ...tokens,
        }
    }

    async registration(userDto: RegisterUserDto) {
        const user_by_login = await this.User_Service.get_by_login(userDto.login);
        if (user_by_login) throw new HttpException('Login Exist', HttpStatus.BAD_REQUEST)
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.User_Service.create({ ...userDto, password: hashPassword })
        const tokens = await this.generate_tokens(user)
        await this.Refresh_Token_Repo.create({user_id: user.id, refresh_token: tokens.refresh_token})
        return {
            user,
            ...tokens,
        }
    }


    private async validate_user(dto: LoginUserDto) {
        const user = await this.User_Service.get_by_login(dto.login)
        if (!user) {
            throw new UnauthorizedException({ message: 'Login Or Password Is Not Correct' });
        }
        const passwordEquals = await bcrypt.compare(dto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({ message: 'Bad Login Or Password' });
    }

    private async generate_tokens(user: any) {
        const payload = {
            id: user.id,
        }
        const access_token = this.Jwt_Service.sign(payload, {
            expiresIn: '10m',
        })
        const refresh_token = this.Jwt_Service.sign(payload, {
            expiresIn: '30d',
        })
        return { access_token, refresh_token }
    }

    async get_new_tokens(refresh_token: string) {
        const result = await this.Jwt_Service.verify(refresh_token)
        if (!result) throw new UnauthorizedException('Token Not Valide')
        const check_token =  await this.Refresh_Token_Repo.findOne({where: {refresh_token: refresh_token}})
        if (!check_token) throw new UnauthorizedException('Token Was Blocked !!!')
        let user = await this.User_Service.get_by_id(result.id)
        if (!user) throw new UnauthorizedException('User Not Found')
        user.password = ''
        if (!user) throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST)
        const tokens = await this.generate_tokens(user)
        return { user, ...tokens }
    }


    add_token_to_response(res: Response, refresh_token: string) {
        const expiresIn = new Date()
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)
        res.cookie(REFRESH_TOKEN_NAME, refresh_token, {
            // domain: process.env.DOMAIN_SERVER,
            domain: undefined,                             // <====== ТУТ ПОМУЧЕЛСЯ ИЗ ЗА ip
            secure: false,

            httpOnly: true,
            expires: expiresIn,
            sameSite: 'none'
        })
    }


    remove_token_from_response(res: Response) {
        res.cookie(REFRESH_TOKEN_NAME, '', {
            // domain: process.env.DOMAIN_SERVER,
            domain: undefined,
            secure: false,

            httpOnly: true,
            expires: new Date(0),
            sameSite: 'none'
        })
    }

    async get_user_from_token(headers: any) {
        try {
            const token = headers.authorization.split(' ')[1]
            if (!token) return null
            const user: any = this.Jwt_Service.verify(token);
            return user
        } catch (error) {
            console.log(error)
            throw new HttpException('Token Not Valid !!!', HttpStatus.BAD_REQUEST)
        }
    }

    async delete_refresh_token(token: string) {
        await this.Refresh_Token_Repo.destroy({where: {refresh_token: token}})
    }





}
