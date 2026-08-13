import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsMongoId, IsString, Matches, Min } from 'class-validator';

export class CreateShowtimeDto {
  @IsMongoId()
  movieId: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  time: string;

  @IsString()
  hall: string;

  @IsEnum(['2D', '3D', 'IMAX', '4DX'])
  format: '2D' | '3D' | 'IMAX' | '4DX';

  @Type(() => Number)
  @IsInt()
  @Min(0)
  basePrice: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  vipPrice: number;
}
