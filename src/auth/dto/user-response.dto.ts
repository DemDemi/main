import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'demskismaili@gmail.com' })
  login: string;

  @ApiProperty({ example: 'demskismaili@gmail.com', required: false })
  email?: string;

  @ApiProperty({ example: '+995 500991737', required: false })
  phone?: string;

  @ApiProperty({ example: 'Demo', required: false })
  name?: string;

  @ApiProperty({ example: 'Dzigua', required: false })
  surname?: string;

}