import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
