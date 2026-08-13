import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Showtime } from '../../showtimes/schemas/showtime.schema';
import { setToJSON } from '../../common/mongoose-options';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Showtime.name, required: true, index: true })
  showtimeId: mongoose.Types.ObjectId;

  /** Seat ids such as "A1", "G12". */
  @Prop({ type: [String], required: true })
  seatIds: string[];

  /** Total price in Toman, computed server-side. */
  @Prop({ required: true })
  totalPrice: number;

  /** Human-friendly tracking code such as "CT-3K9WQZ". */
  @Prop({ required: true, unique: true })
  referenceCode: string;

  @Prop({ default: false })
  confirmed: boolean;

  /** Set when the booking is cancelled; non-null means seats are released. */
  @Prop({ type: Date, default: null })
  cancelledAt: Date | null;
}

export const BookingSchema = setToJSON(SchemaFactory.createForClass(Booking));
