import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileResponseDto } from 'src/files/dto/file-response.dto';
import { UserResponseDto } from 'src/auth/dto/user-response.dto';

@Controller('users')
export class UsersController {

}
