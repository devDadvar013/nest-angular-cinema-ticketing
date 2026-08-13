import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll(@Query('nowShowing') nowShowing?: string) {
    const flag = nowShowing === undefined ? undefined : nowShowing === 'true';
    return this.moviesService.findAll(flag);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }
}
