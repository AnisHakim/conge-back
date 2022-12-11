import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { EventsController } from './events.controller';
import { EventPorvider } from './events.provider';
import { EventsService } from './events.service';

@Module({
    imports: [DatabaseModule, UsersModule],
    controllers: [EventsController],
    providers: [EventsService, ...EventPorvider],
    exports: [EventsService, ...EventPorvider]
})
export class EventsModule { }
