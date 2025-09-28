import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService, REFRESH_TOKEN_NAME } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Headers } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthInfoResponseDto } from './dto/auth-info-response.dto';
@ApiTags('Autorization')
@Controller('auth')
export class AuthController {

    constructor(private Auth_Service: AuthService) { }

    @ApiOperation({ summary: 'User Registration' })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @Post('/signup')
    async registration(@Body() userDto: RegisterUserDto, @Res({ passthrough: true }) res: Response) {
        const { refresh_token, ...response } = await this.Auth_Service.registration(userDto)
        this.Auth_Service.add_token_to_response(res, refresh_token)
        return response
    }

    @ApiOperation({ summary: 'Login User' })
    @ApiResponse({ status: 200, description: 'New token', type: AuthResponseDto })
    @Post('/signin')
    async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
        const { refresh_token, ...response } = await this.Auth_Service.login(dto)
        this.Auth_Service.add_token_to_response(res, refresh_token)
        return response
    }

    @ApiOperation({ summary: 'Get New access_token Using tefresh_oken' })
    @ApiResponse({ status: 200, description: 'New token', type: AuthResponseDto })
    @Post('/signin/new_token')
    async get_new_tokens(
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request
    ) {
        const refresh_token_from_cookies = req.cookies[REFRESH_TOKEN_NAME]
        console.log(req.cookies)
        if (!refresh_token_from_cookies) {
            this.Auth_Service.remove_token_from_response(res)
            throw new UnauthorizedException('Bad Refresh Token')
        }
        const { refresh_token, ...response } =
            await this.Auth_Service.get_new_tokens(refresh_token_from_cookies)
        this.Auth_Service.add_token_to_response(res, refresh_token)
        return response
    }

    @ApiOperation({ summary: 'Get By Id' })
    @ApiResponse({ status: 200, type: AuthInfoResponseDto })
    @UseGuards(JwtAuthGuard)
    @Get('info')
    async info(@Headers() headers,) {
        const user: any = await this.Auth_Service.get_user_from_token(headers)
        return user
    }

    @ApiOperation({ summary: 'User Logout' })
    @ApiResponse({ status: 200, description: 'New token', type: Boolean })
    @Post('/logout')
    async log_out(@Res({ passthrough: true }) res: Response,  @Req() req: Request) {
        this.Auth_Service.remove_token_from_response(res)
        const refresh_token_from_cookies = req.cookies[REFRESH_TOKEN_NAME]
        await this.Auth_Service.delete_refresh_token(refresh_token_from_cookies)
        return true
    }


}

