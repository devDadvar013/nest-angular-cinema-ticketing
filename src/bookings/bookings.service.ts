import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { seatRow, VIP_ROWS, isValidSeatId } from '../common/seat-layout';
import { Movie } from '../movies/schemas/movie.schema';
import { Showtime } from '../showtimes/schemas/showtime.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingDocument } from './schemas/booking.schema';

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Showtime.name) private readonly showtimeModel: Model<Showtime>,
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {}

  async create(dto: CreateBookingDto): Promise<BookingDocument> {
    const showtime = await this.showtimeModel.findById(dto.showtimeId).exec();
    if (!showtime) {
      throw new NotFoundException(`Showtime ${dto.showtimeId} not found`);
    }

    const seatIds = [...new Set(dto.seatIds)];
    if (seatIds.length !== dto.seatIds.length) {
      throw new BadRequestException('seatIds must not contain duplicates');
    }
    if (seatIds.some((id) => !isValidSeatId(id))) {
      throw new BadRequestException('Invalid seat id in seatIds');
    }

    const conflicts = await this.bookingModel
      .find({ showtimeId: dto.showtimeId, cancelledAt: null, seatIds: { $in: seatIds } })
      .exec();
    if (conflicts.length > 0) {
      throw new ConflictException('One or more seats are already reserved');
    }

    const totalPrice = this.computeTotalPrice(showtime, seatIds);
    const booking = await this.bookingModel.create({
      showtimeId: dto.showtimeId,
      seatIds: [...seatIds].sort((a, b) => a.localeCompare(b)),
      totalPrice,
      referenceCode: await this.generateReferenceCode(),
      confirmed: false,
      cancelledAt: null,
    });

    return booking;
  }

  async findOne(id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }
    return booking;
  }

  /** Resolves a booking by its public tracking code, enriched with showtime + movie. */
  async trackByReferenceCode(code: string) {
    const referenceCode = code.trim().toUpperCase();
    const booking = await this.bookingModel.findOne({ referenceCode }).exec();
    if (!booking) {
      throw new NotFoundException(`No booking found for code ${referenceCode}`);
    }

    const showtime = await this.showtimeModel.findById(booking.showtimeId).exec();
    if (!showtime) {
      throw new NotFoundException(`Showtime ${booking.showtimeId} not found`);
    }

    const movie = await this.movieModel.findById(showtime.movieId).exec();
    if (!movie) {
      throw new NotFoundException(`Movie ${showtime.movieId} not found`);
    }

    return { booking, showtime, movie };
  }

  async confirm(id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel
      .findByIdAndUpdate(id, { $set: { confirmed: true } }, { new: true })
      .exec();
    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }
    return booking;
  }

  async cancel(id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel
      .findByIdAndUpdate(id, { $set: { cancelledAt: new Date() } }, { new: true })
      .exec();
    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }
    return booking;
  }

  private computeTotalPrice(showtime: Showtime, seatIds: string[]): number {
    let total = 0;
    for (const seatId of seatIds) {
      total += VIP_ROWS.has(seatRow(seatId)) ? showtime.vipPrice : showtime.basePrice;
    }
    return total;
  }

  private async generateReferenceCode(): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      let code = '';
      for (let i = 0; i < 6; i += 1) {
        code += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)];
      }
      const referenceCode = `CT-${code}`;
      const exists = await this.bookingModel.exists({ referenceCode });
      if (!exists) {
        return referenceCode;
      }
    }
    throw new Error('Could not generate a unique reference code');
  }
}
