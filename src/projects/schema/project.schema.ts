import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import * as mongoose from 'mongoose';
@Schema({ timestamps: true })
export class Project {
    @Prop()
    name: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    scrum: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    po: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    techLead: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    teamLead: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    rh: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    admin: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    marketing: User;
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
    developersIds: mongoose.Schema.Types.ObjectId[]
    @Prop()
    startDate: Date;
    @Prop()
    endDate: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);