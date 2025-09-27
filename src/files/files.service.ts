import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { File } from './file.model';
import { InjectModel } from '@nestjs/sequelize';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import sequelize from 'sequelize/lib/sequelize';


export interface file_filter {
    page: number,
    list_size: number
}

@Injectable()
export class FilesService {

    constructor(
        @InjectModel(File)
        private File_Repo: typeof File,
    ) { }


    async create_file(file: any, user_id: number): Promise<any> {
        const saved_file = await this.write_file(file)
        const file_record = await this.File_Repo.create({
            path_name: saved_file.file_name,
            name: file.originalname,
            extension: path.extname(file.originalname).replace('.', '') || 'bin',
            mime_type: file.mimetype || 'application/octet-stream',
            size: file.size,
            uploaded_at: new Date(),
            user_id,
        })

        const result = file_record.toJSON() as any
        result.file_path = saved_file.file_name
        return result
    }

    async update_file(file: any, user_id: number, id: number): Promise<any> {
        const old_file = await this.File_Repo.findByPk(id);
        if (!old_file) throw new HttpException('File Not Found', HttpStatus.BAD_REQUEST);
        if (old_file.user_id !== user_id) throw new HttpException('Its Not Ur File !', HttpStatus.FORBIDDEN);

        const new_file_name = uuid.v4() + path.extname(file.originalname);
        await this.overwrite_file(file, new_file_name);

        if (old_file.path_name !== new_file_name) {
            const old_file_path = path.resolve(__dirname, '..', 'static', old_file.path_name);
            if (fs.existsSync(old_file_path)) fs.unlinkSync(old_file_path);
        }

        old_file.name = file.originalname;
        old_file.path_name = new_file_name;
        old_file.extension = path.extname(file.originalname).replace('.', '') || 'bin';
        old_file.mime_type = file.mimetype || 'application/octet-stream';
        old_file.size = file.size;
        old_file.uploaded_at = new Date();

        await old_file.save();
        const result = old_file.toJSON() as any;
        result.file_path = new_file_name;
        return result;
    }



    async get_list(filter: file_filter) {
        const limit = filter.list_size;
        let page = filter.page;

        const total_count = await this.File_Repo.count();
        const pages_count = Math.ceil(total_count / limit);

        if (page * limit >= total_count) {
            page = 0;
        }

        const files = await this.File_Repo.findAll({
            include: { all: true },
            offset: page * limit,
            limit,
            order: [['id', 'DESC']],
        });

        return {
            total_count,
            pages_count,
            page,
            files,
        };
    }

    async get_by_id(id: number) {
        const file = await this.File_Repo.findByPk(id)
        if (!file) throw new HttpException('File Not Found !', HttpStatus.NOT_FOUND)
        return file
    }


    async delete(file_id: number, user_id: number): Promise<boolean> {
        try {
            const file_data = await this.get_by_id(file_id);
            if (file_data.user_id !== user_id) throw new HttpException('Its Not Ur File !', HttpStatus.FORBIDDEN);

            await this.File_Repo.destroy({ where: { id: file_id } });
            await this.delete_file(file_data.path_name);

            return true;
        } catch (e) {
            throw new HttpException('Delete File Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }






    //======================================================> FS

    async write_file(file: any) {
        try {
            const file_name = uuid.v4() + path.extname(file.originalname)
            const file_path = path.resolve(__dirname, '..', 'static')

            if (!fs.existsSync(file_path)) {
                fs.mkdirSync(file_path, { recursive: true });
            }
            fs.writeFileSync(path.join(file_path, file_name), file.buffer)
            return { file_name: file_name }
        } catch (e) {
            throw new HttpException('Error Save File', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async overwrite_file(file: any, file_name: string) {
        try {
            const file_path = path.resolve(__dirname, '..', 'static');
            if (!fs.existsSync(file_path)) fs.mkdirSync(file_path, { recursive: true });
            const full_path = path.join(file_path, file_name);
            fs.writeFileSync(full_path, file.buffer);
            return { file_name };
        } catch (e) {
            throw new HttpException('Error Overwriting File', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete_file(file_name: string): Promise<void> {
        try {
            const full_path = path.resolve(__dirname, '..', 'static', file_name);
            if (fs.existsSync(full_path)) fs.unlinkSync(full_path);
        } catch (e) {
    
        }
    }



}
