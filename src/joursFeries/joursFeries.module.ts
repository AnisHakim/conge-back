import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { JoursFeriesController } from './joursFeries.controller';
import { JoursFeriesProvider } from './joursFeries.provider';
import { JoursFeriesService } from './joursFeries.service';

@Module({
  imports: [DatabaseModule],
  controllers: [JoursFeriesController],
  providers: [JoursFeriesService, ...JoursFeriesProvider],
  exports: [JoursFeriesService, ...JoursFeriesProvider],
})
export class JoursFeriesModule {}
