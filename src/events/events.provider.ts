import { Connection } from "mongoose";
import { DB_PROVIDER, EVENT_PROVIDER } from "src/common/Config/config";
import { eventSchema } from "./schema/events.schema";

export const EventPorvider = [{
    provide: EVENT_PROVIDER,
    inject: ['DatabaseProvider'],
    useFactory: (connection: Connection) => connection.model('Event', eventSchema)
}];