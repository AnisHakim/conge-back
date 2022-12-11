import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { UsersModule } from 'src/users/users.module';
import { congesController } from './conges.controller';
import { CongeProvider } from './conges.provider';
import { congesService } from './conges.service';

@Module({
  imports: [DatabaseModule, UsersModule, ProjectsModule],
  controllers: [congesController],
  providers: [congesService, ...CongeProvider],
  exports: [congesService, ...CongeProvider]
})
export class congesModule { }
