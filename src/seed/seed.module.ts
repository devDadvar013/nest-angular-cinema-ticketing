import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from '../movies/schemas/movie.schema';
import { Showtime, ShowtimeSchema } from '../showtimes/schemas/showtime.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: Showtime.name, schema: ShowtimeSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
