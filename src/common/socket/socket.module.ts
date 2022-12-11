import { JwtModule } from '@nestjs/jwt';
import { SocketService } from './socket.service';
import { CacheModule, Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketProvider } from './socket.provider';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { congesService } from 'src/conges/conges.service';
import { CongeProvider } from 'src/conges/conges.provider';
import { UsersService } from 'src/users/users.service';
import { UserProvider } from 'src/users/user.provider';
import { MailService } from 'src/mail/mail.service';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectProvider } from 'src/projects/project.provider';
@Module({
  imports: [
    CacheModule.register(),
    DatabaseModule,
    PassportModule.register({ defaultStrategy: ['jwt'] }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  providers: [
    SocketGateway,
    SocketService,
    congesService,
    UsersService,
    MailService,
    ProjectsService,
    ...ProjectProvider,
    ...UserProvider,
    ...SocketProvider,
    ...CongeProvider,
  ],
})
export class SocketModule { }
