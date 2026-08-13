import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Movie } from '../../movies/schemas/movie.schema';
import { setToJSON } from '../../common/mongoose-options';

export type ShowtimeDocument = HydratedDocument<Showtime>;
export type ShowtimeFormat = '2D' | '3D' | 'IMAX' | '4DX';

@Schema({ timestamps: true })
export class Showtime {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Movie.name, required: true, index: true })
  movieId: mongoose.Types.ObjectId;

  /** ISO date (yyyy-mm-dd) so results sort correctly and convert to Jalali. */
  @Prop({ required: true })
  date: string;

  /** Show time HH:mm. */
  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  hall: string;

  @Prop({ required: true, enum: ['2D', '3D', 'IMAX', '4DX'] })
  format: ShowtimeFormat;

  @Prop({ required: true })
  basePrice: number;

  @Prop({ required: true })
  vipPrice: number;
}

export const ShowtimeSchema = setToJSON(SchemaFactory.createForClass(Showtime));
