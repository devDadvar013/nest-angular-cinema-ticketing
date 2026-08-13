import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Post(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.bookingsService.confirm(id);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }
}
