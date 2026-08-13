import { Schema } from 'mongoose';

/**
 * Serializes every document with a string `id` (instead of `_id`) so the API
 * matches the frontend model (Movie.id, Showtime.id, Booking.id).
 */
export function setToJSON(schema: Schema): Schema {
  return schema.set('toJSON', {
    versionKey: false,
    transform: (_doc: unknown, ret: Record<string, unknown>): Record<string, unknown> => {
      ret.id = String(ret._id);
      delete ret._id;
      return ret;
    },
  });
}
