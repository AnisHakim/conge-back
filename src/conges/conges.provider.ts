import { Connection } from "mongoose";
import { CongeSchema } from "./schema/conges.schema";

export const CongeProvider = [{

    provide: "CongeProvider",
    inject: ['DatabaseProvider'],
    useFactory: (connection: Connection) => connection.model('Conge', CongeSchema)
}];