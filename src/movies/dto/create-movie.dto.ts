import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  originalTitle: string;

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsInt()
  @Min(1)
  durationMin: number;

  @IsString()
  ageRating: string;

  @IsNumber()
  rating: number;

  @IsString()
  synopsis: string;

  @IsString()
  director: string;

  @IsArray()
  @IsString({ each: true })
  cast: string[];

  @IsString()
  releaseYear: string;

  @IsString()
  accentFrom: string;

  @IsString()
  accentTo: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  nowShowing?: boolean;
}
