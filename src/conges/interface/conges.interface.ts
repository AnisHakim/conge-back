import { Document } from 'mongoose';

export interface CongeDocument extends Document {
  dates: Date[];
  paid: boolean;
  authorization: boolean;
  startAutorization: string;
  durationAutorization: number;
  half_day: boolean;
  morning: boolean;
  department: string;
  project: string;
  description: string;
  reason: string;
  user: string;
  validation: boolean;
  disabled: boolean;
  dateAutorization: Date
}
