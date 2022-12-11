import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { RefreshStrategy } from 'src/common/strategy/refresh.strategy';

@Module({
  providers: [AuthService, JwtStrategy, RefreshStrategy],
  controllers: [AuthController],
  imports: [UsersModule, MailModule,
    PassportModule.register({ defaultStrategy: ['jwt', "refresh"] }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ]
})
export class AuthModule { }
