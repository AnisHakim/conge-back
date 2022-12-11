import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import * as mongoose from 'mongoose';
import { Project } from 'src/projects/schema/project.schema';


@Schema({ timestamps: true })
export class Conge {

    @Prop([Date])
    dates: Date[];
    @Prop()
    paid: boolean;
    @Prop()
    authorization: boolean;
    @Prop()
    startAutorization: string;
    @Prop()
    durationAutorization: number;
    @Prop()
    half_day: boolean;
    @Prop()
    morning: boolean;
    @Prop()
    department: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Project" })
    project: Project;
    @Prop()
    description: string;
    @Prop()
    reason: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;
    @Prop({ default: false })
    isAccepted: boolean;
    @Prop({ default: false })
    isRefused: boolean;
    @Prop({ enum: ["inProgress", "refused", "accepted"], required: true, default: 'inProgress' })
    status: string;
    @Prop()
    disabled: boolean;
    @Prop()
    dateAutorization: Date
}

export const CongeSchema = SchemaFactory.createForClass(Conge);