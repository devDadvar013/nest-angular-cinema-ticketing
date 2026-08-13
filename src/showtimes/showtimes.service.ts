import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { buildSeatMap, SeatRow } from '../common/seat-layout';
import { Booking } from '../bookings/schemas/booking.schema';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { Showtime, ShowtimeDocument } from './schemas/showtime.schema';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectModel(Showtime.name) private readonly showtimeModel: Model<ShowtimeDocument>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
  ) {}

  findForMovie(movieId: string): Promise<ShowtimeDocument[]> {
    return this.showtimeModel
      .find({ movieId })
      .sort({ date: 1, time: 1 })
      .exec();
  }

  async findOne(id: string): Promise<ShowtimeDocument> {
    const showtime = await this.showtimeModel.findById(id).exec();
    if (!showtime) {
      throw new NotFoundException(`Showtime ${id} not found`);
    }
    return showtime;
  }

  /** Seat map for a showtime, marking seats held by active bookings as reserved. */
  async getSeats(id: string): Promise<SeatRow[]> {
    const showtime = await this.showtimeModel.findById(id).exec();
    if (!showtime) {
      throw new NotFoundException(`Showtime ${id} not found`);
    }

    const activeBookings = await this.bookingModel
      .find({ showtimeId: id, cancelledAt: null }, { seatIds: 1 })
      .exec();

    const reservedSeatIds = new Set<string>();
    for (const booking of activeBookings) {
      for (const seatId of booking.seatIds) {
        reservedSeatIds.add(seatId);
      }
    }

    return buildSeatMap(reservedSeatIds);
  }

  create(dto: CreateShowtimeDto): Promise<ShowtimeDocument> {
    return this.showtimeModel.create(dto);
  }
}
