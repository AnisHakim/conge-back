import { User } from './../users/interface/user.interface';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    JwtService: any;
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService) { }
    async login(email: string, password: string) {
        const user = await this.usersService.getUserByEmail(email);
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) return this.generateToken(user)

        }
        return false;
    }
    async generateToken(user: User): Promise<any> {
        const payload = { id: user.id }
        const accessToken: string = this.jwtService.sign(payload, {
            expiresIn: process.env.ACCESS_TOKEN_TIMEOUT,
            secret: process.env.JWT_SECRET_KEY,
        });
        const refreshToken: string = this.jwtService.sign(payload, {
            expiresIn: process.env.REFRESH_TOKEN_TIMEOUT,
            secret: process.env.REFRESH_SECRET_KEY,
        });
        return { accessToken, refreshToken };
    }
    async getUser(email: string) {
        return await this.usersService.getUserByEmail(email);
    }
}
