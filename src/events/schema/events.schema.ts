import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class Event {
    @Prop()
    description: string;
    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    })
    userId: string;
    @Prop()
    sold: number;
}
export const eventSchema = SchemaFactory.createForClass(Event);

