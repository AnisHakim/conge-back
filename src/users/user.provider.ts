import { Connection } from "mongoose";
import { UserSchema } from "./schema/user.schema";

export const UserProvider = [{
    provide: 'UserProvider',
    useFactory: (connection: Connection) =>
        connection.model('User', UserSchema),
    inject: ['DatabaseProvider']
}]