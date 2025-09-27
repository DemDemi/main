import { ApiProperty } from '@nestjs/swagger';

export class AuthInfoResponseDto {

  @ApiProperty({ example: 'User Id By Token' })
  id: number;

}