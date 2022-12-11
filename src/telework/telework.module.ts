import { TeleworkProvider } from './telework.provider';
import { TeleworkService } from './telework.service';
import { TeleworkController } from './telework.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
    imports: [DatabaseModule, UsersModule],
    controllers: [TeleworkController],
    providers: [TeleworkService, ...TeleworkProvider],
    exports: [TeleworkService]
})
export class TeleworkModule { }
