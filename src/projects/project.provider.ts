import { Connection } from "mongoose";

import { ProjectSchema } from "./schema/project.schema";

export const ProjectProvider = [{
    provide: 'ProjectProvider',
    useFactory: (connection: Connection) =>
        connection.model('Project', ProjectSchema),
    inject: ['DatabaseProvider']
}];