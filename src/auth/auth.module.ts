import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'No_PPP_Key',
      signOptions: {
        expiresIn: '100h'
      }
    })
  ],
  exports: [
    AuthModule,
    JwtModule,
    AuthService
  ]
})
export class AuthModule { }
