import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { UsersModule } from 'src/users/users.module';
import { ProjectsModule } from 'src/projects/projects.module';
@Global() // 👈 global module
@Module({
  imports: [UsersModule, ProjectsModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
