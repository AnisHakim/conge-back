import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schema/user.schema';
@Schema()
class Telework {
    @Prop([Date])
    dates: Date[];
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;
    @Prop({ enum: ["inProgress", "refused", "accepted"], required: true, default: 'inProgress' })
    status: string;
    @Prop()
    reason: string
}

export const TeleworkSchema = SchemaFactory.createForClass(Telework);
