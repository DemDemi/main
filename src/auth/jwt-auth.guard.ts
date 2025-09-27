import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';


@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private jwt_service: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const auth_Header = req.headers.authorization;
            const bearer = auth_Header.split(' ')[0]
            const token = auth_Header.split(' ')[1]
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'User Ar Not Authorized' })
            }
            const user = this.jwt_service.verify(token);
            if (!user) throw new UnauthorizedException({ message: 'User Ar Not Authorized' })
            return user
        } catch (e) {
            const m = e?.message || '';
            if (m.includes('jwt expired')) {
                throw new UnauthorizedException({ message: 'Token Expired Get New' });
            }
            throw new UnauthorizedException({ message: 'User Are Not Authorized' });
        }
    }


}

