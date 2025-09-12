import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RawDataDocument = RawData & Document;

@Schema()
export class RawData {
  @Prop({ required: true })
  resultTime: Date;

  @Prop({ required: true })
  enodebId: number;


  @Prop({ required: true })
  cellId: number;


  @Prop({ required: true })
  availDur: number;
}

export const RawDataSchema = SchemaFactory.createForClass(RawData);

RawDataSchema.index({ enodebId: 1, cellId: 1, resultTime: 1 }, { unique: true });
