import { Connection } from 'mongoose';
import { JoursFeriesSchema } from './schema/joursFeries.schema';

export const JoursFeriesProvider = [
  {
    provide: 'JoursFeriesProvider',
    inject: ['DatabaseProvider'],
    useFactory: (connection: Connection) =>
      connection.model('JoursFeries', JoursFeriesSchema),
  },
];
