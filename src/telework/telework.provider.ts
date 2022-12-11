import { Connection } from 'mongoose';
import { TeleworkSchema } from './schema/telework.schema';

export const TeleworkProvider = [
    {
        provide: 'TeleworkProvider',
        inject: ['DatabaseProvider'],
        useFactory: (connection: Connection) =>
            connection.model('Teleworks', TeleworkSchema),
    },
];