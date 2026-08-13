import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie, MovieDocument } from './schemas/movie.schema';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
  ) {}

  findAll(nowShowing?: boolean): Promise<MovieDocument[]> {
    const filter = nowShowing === undefined ? {} : { nowShowing };
    return this.movieModel.find(filter).sort({ title: 1 }).exec();
  }

  async findOne(id: string): Promise<MovieDocument> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) {
      throw new NotFoundException(`Movie ${id} not found`);
    }
    return movie;
  }

  create(dto: CreateMovieDto): Promise<MovieDocument> {
    return this.movieModel.create(dto);
  }
}
