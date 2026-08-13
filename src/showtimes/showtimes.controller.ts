import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { ShowtimesService } from './showtimes.service';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get()
  findForMovie(@Query('movieId') movieId: string) {
    return this.showtimesService.findForMovie(movieId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(id);
  }

  @Get(':id/seats')
  getSeats(@Param('id') id: string) {
    return this.showtimesService.getSeats(id);
  }

  @Post()
  create(@Body() dto: CreateShowtimeDto) {
    return this.showtimesService.create(dto);
  }
}
