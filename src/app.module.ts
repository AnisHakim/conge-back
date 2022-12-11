import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { congesModule } from './conges/conges.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { Cron, ScheduleModule } from '@nestjs/schedule';
import { SocketModule } from './common/socket/socket.module';
import { User } from 'src/users/interface/user.interface';
import * as mongoose from 'mongoose';
import { USER_PROVIDER } from './common/Config/config';
import { EventsModule } from './events/events.module';
import { congesService } from './conges/conges.service';
import { JoursFeriesModule } from './joursFeries/joursFeries.module';
import { TeleworkModule } from './telework/telework.module';
@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    congesModule,
    MailModule,
    SocketModule,
    EventsModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    JoursFeriesModule,
    TeleworkModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    @Inject(USER_PROVIDER)
    private readonly userDocument: mongoose.Model<User>,
    private readonly congeService: congesService,
  ) { }

  @Cron('0 0 1 * *')
  async updateSoldeEveryMonth() {
    await this.userDocument.updateMany(
      { isFullTime: true },
      {
        $inc: { pay: 1.75 }
      })
    await this.userDocument.updateMany({ isFullTime: false }, { $inc: { pay: 0.875 } });
    await this.congeService.usersAutorisation();

  }
  @Cron('0 0 1 1 *')
  async updateSoldeEveryYear() {
    await this.userDocument.updateMany({ isReportSold: false }, { pay: 0 });
  }
}
