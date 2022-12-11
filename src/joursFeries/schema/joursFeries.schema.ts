import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class JoursFeries {
  @Prop([Date])
  dates: Date[];
  @Prop()
  description: string;
}

export const JoursFeriesSchema = SchemaFactory.createForClass(JoursFeries);
