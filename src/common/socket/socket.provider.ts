import { Connection } from 'mongoose';
import { DB_PROVIDER, SOCKET_PROVIDER } from '../Config/config';
import { SocketSchema } from './schema/socket.schema';

export const SocketProvider = [
  {
    provide: SOCKET_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Socket', SocketSchema),
    inject: [DB_PROVIDER],
  },
];
