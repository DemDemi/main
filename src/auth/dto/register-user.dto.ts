import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {

  @ApiProperty({ example: 'Number Or Email' })
  @IsString()
  @IsNotEmpty({ message: 'Login Requires' })
  readonly login: string;

  @ApiProperty({ example: 'Password' })
  @IsString()
  @IsNotEmpty({ message: 'Password Required' })
  readonly password: string;
}

