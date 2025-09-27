import { forwardRef, Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './file.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([File]),
  ],
})
export class FilesModule { }
