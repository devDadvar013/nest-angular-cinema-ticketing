import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from '../movies/schemas/movie.schema';
import { Showtime, ShowtimeSchema } from '../showtimes/schemas/showtime.schema';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking, BookingSchema } from './schemas/booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      // Needed to recompute the price from the showtime pricing.
      { name: Showtime.name, schema: ShowtimeSchema },
      // Needed to enrich tickets resolved by tracking code.
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
