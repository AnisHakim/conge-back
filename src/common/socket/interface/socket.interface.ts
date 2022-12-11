import { Document } from 'mongoose';
export interface Socket extends Document {
  socketId: string;
  userId: string;
}
