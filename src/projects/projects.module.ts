import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { ProjectProvider } from './project.provider';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ...ProjectProvider],
  exports: [ProjectsService, ...ProjectProvider]
})
export class ProjectsModule { }
