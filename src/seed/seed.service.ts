import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../movies/schemas/movie.schema';
import { Showtime } from '../showtimes/schemas/showtime.schema';
import { SEED_MOVIES, SEED_SHOWTIMES } from './seed-data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(Showtime.name) private readonly showtimeModel: Model<Showtime>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.seed();
    } catch (error) {
      this.logger.warn(
        `Seeding skipped (is MongoDB running?): ${(error as Error).message}`,
      );
    }
  }

  private async seed(): Promise<void> {
    const movieCount = await this.movieModel.countDocuments();
    if (movieCount > 0) {
      return;
    }

    const movies = SEED_MOVIES.map(({ key: _key, ...movie }) => movie);
    const createdMovies = await this.movieModel.insertMany(movies);

    const idByKey = new Map<string, unknown>();
    SEED_MOVIES.forEach((movie, index) => {
      idByKey.set(movie.key, createdMovies[index]._id);
    });

    const showtimes = SEED_SHOWTIMES.map(({ movieKey, ...showtime }) => ({
      ...showtime,
      movieId: idByKey.get(movieKey),
    }));

    await this.showtimeModel.insertMany(showtimes);
    this.logger.log(`Seeded ${createdMovies.length} movies and ${showtimes.length} showtimes`);
  }
}
