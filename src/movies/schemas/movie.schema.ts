import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { setToJSON } from '../../common/mongoose-options';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  originalTitle: string;

  @Prop({ type: [String], default: [] })
  genres: string[];

  @Prop({ required: true })
  durationMin: number;

  @Prop({ required: true })
  ageRating: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  synopsis: string;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String], default: [] })
  cast: string[];

  @Prop({ required: true })
  releaseYear: string;

  @Prop({ required: true })
  accentFrom: string;

  @Prop({ required: true })
  accentTo: string;

  @Prop({ default: true })
  nowShowing: boolean;
}

export const MovieSchema = setToJSON(SchemaFactory.createForClass(Movie));
