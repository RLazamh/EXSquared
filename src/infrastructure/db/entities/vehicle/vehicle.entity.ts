import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vehicle extends Document {
  @Prop({ required: true })
  makeId: string;

  @Prop({ required: true })
  makeName: string;

  @Prop({ required: false })
  vehicleTypes?: {
    typeId: string;
    typeName: string;
  }[];
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
