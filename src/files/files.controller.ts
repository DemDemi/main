import { Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Headers } from '@nestjs/common';
import { User } from 'src/users/user.model';
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileUploadDto } from './dto/upload-file.dto';
import { FileResponseDto } from './dto/file-response.dto';

import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('files')
export class FilesController {

    constructor(
        private Files_Service: FilesService,
        private Auth_Service: AuthService,
    ) { }




    @ApiOperation({ summary: 'Download By Id' })
    @ApiResponse({ status: 200, type: FileResponseDto })
    // @UseGuards(JwtAuthGuard)
    @Get('download/:id')
    async download(@Param('id') id: number, @Res() res: Response) {
        const file = await this.Files_Service.get_by_id(id);
        const file_path = path.resolve(__dirname, '..', 'static', file.path_name);
        if (!fs.existsSync(file_path)) {
            throw new NotFoundException('File not found on disk');
        }
        res.set({
            'Content-Type': file.mime_type,
            'Content-Disposition': `attachment; filename="${file.name}"`,
        });
        res.sendFile(file.path_name, { root: path.resolve(__dirname, '..', 'static') });
    }


    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create File' })
    @ApiResponse({ status: 200, description: 'New File', type: FileResponseDto })
    @ApiBody({
        description: 'Upload a file',
        type: FileUploadDto,
    })

    @UseGuards(JwtAuthGuard)
    @UsePipes()
    @UseInterceptors(FileInterceptor('file'))
    @Post('/upload')
    async create_file(
        @Headers() headers,
        @UploadedFile() file,
    ) {
        const user: User = await this.Auth_Service.get_user_from_token(headers)
        return this.Files_Service.create_file(file, user.id);
    }

    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Updaye File' })
    @ApiResponse({ status: 200, description: 'New File', type: FileResponseDto })
    @ApiBody({
        description: 'Upload a file',
        type: FileUploadDto,
    })
    @UseGuards(JwtAuthGuard)
    @UsePipes()
    @UseInterceptors(FileInterceptor('file'))
    @Put('/update/:id')
    async update_file(
        @Headers() headers,
        @UploadedFile() file,
        @Param('id') id: number
    ) {
        const user: User = await this.Auth_Service.get_user_from_token(headers)
        return this.Files_Service.update_file(file, user.id, id);
    }

    @ApiOperation({ summary: 'Get Files' })
    @ApiResponse({ status: 200, type: [FileResponseDto] })
    @UseGuards(JwtAuthGuard)
    @Get('/list')
    async get_list(
        @Query('page') page: number = 0,
        @Query('list_size') list_size: number = 10,
    ) {
        return this.Files_Service.get_list({
            page: Number(page) || 0,
            list_size: Number(list_size) || 10,
        });
    }

    @ApiOperation({ summary: 'Create File' })
    @ApiResponse({ status: 200, description: 'New File', type: Boolean })
    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    async delete(@Headers() headers, @Param('id') id: number) {
        const user: User = await this.Auth_Service.get_user_from_token(headers)
        await this.Files_Service.delete(id, user.id);
        return true
    }

    @ApiOperation({ summary: 'Get By Id' })
    @ApiResponse({ status: 200, type: FileResponseDto })
    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async get_by_id(@Param('id') id: number) {
        return await this.Files_Service.get_by_id(id);
    }


}
