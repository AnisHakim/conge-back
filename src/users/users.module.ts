import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { UserProvider } from './user.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
@Module({
    imports: [DatabaseModule],
    providers: [UsersService, ...UserProvider],
    controllers: [UsersController],
    exports: [UsersService, ...UserProvider]
})
export class UsersModule { }
