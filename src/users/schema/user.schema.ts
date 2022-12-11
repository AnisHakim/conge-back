import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/role/role.enum';
export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    email: string;
    @Prop({ required: true })
    password: string;
    @Prop({ required: true })
    roles: Role[];
    @Prop({ required: true })
    start: Date;
    @Prop({ default: 0 })
    pay: number;
    @Prop({ default: false })
    isReportSold: boolean
    @Prop({ default: true })
    isFullTime: boolean
}
export const UserSchema = SchemaFactory.createForClass(User);