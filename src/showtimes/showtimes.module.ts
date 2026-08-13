import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Showtime, ShowtimeSchema } from './schemas/showtime.schema';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Showtime.name, schema: ShowtimeSchema },
      // Needed to compute which seats are already reserved.
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
