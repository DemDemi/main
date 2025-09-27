import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '93d1083e-e405-49b8-9f19-5a39c6789803.JPG' })
  path_name: string;

  @ApiProperty({ example: 'Name.JPG' })
  name: string;

  @ApiProperty({ example: 'JPG' })
  extension: string;

  @ApiProperty({ example: 'image/jpeg' })
  mime_type: string;

  @ApiProperty({ example: 5131776 })
  size: number;

  @ApiProperty({ example: '2025-09-27T06:55:05.228Z' })
  uploaded_at: string;

  @ApiProperty({ example: 1 })
  user_id: number;

  @ApiProperty({ example: '2025-09-27T06:55:05.228Z' })
  updatedAt: string;

  @ApiProperty({ example: '2025-09-27T06:55:05.228Z' })
  createdAt: string;

  @ApiProperty({ example: '93d1083e-e405-49b8-9f19-5a39c6789803.JPG' })
  file_path: string;
}
