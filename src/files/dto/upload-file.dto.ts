import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty()
  file: any;
}