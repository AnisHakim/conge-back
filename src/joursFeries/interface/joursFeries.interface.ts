import { Document } from 'mongoose';

export interface JoursFeriesDocument extends Document {
  dates: Date[];
  description: string;
}
