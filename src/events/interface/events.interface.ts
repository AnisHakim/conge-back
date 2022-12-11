import { Document } from 'mongoose';

export interface EventDocument extends Document {
    description: string,
    sold: number,
    userId: string
}
