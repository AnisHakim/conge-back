import { Inject, Injectable } from '@nestjs/common';
import { EVENT_PROVIDER } from 'src/common/Config/config';
import * as mongoose from 'mongoose';
import { EventDocument } from './interface/events.interface';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class EventsService {
    constructor(
        @Inject(EVENT_PROVIDER)
        private eventDocument: mongoose.Model<EventDocument>,
        private userService: UsersService,
    ) { }
    async addUserSold(description: string, sold: number, userId: string) {
        const event = new this.eventDocument(
            {
                description: description, sold: sold, userId: userId,

            });
        this.userService.updateSoldUser(userId, sold)
        const res = event.save();
        return res;
    }
}
