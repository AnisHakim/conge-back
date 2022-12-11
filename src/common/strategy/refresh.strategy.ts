
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        private readonly userService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.REFRESH_SECRET_KEY
        });
    }
    async validate(payload: any) {
        const user = this.userService.getUserById(payload.id);
        if (!user) {
            throw new UnauthorizedException()
        }
        return user;

    }
}