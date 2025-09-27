import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.model';
import { UserResponseDto } from './user-response.dto';

export class AuthResponseDto {

  @ApiProperty({ example: 'Bearer eyJhbGciOi...' })
  access_token: string;

  @ApiProperty({ example:  UserResponseDto})
  user: UserResponseDto;
}