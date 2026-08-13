import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsMongoId()
  showtimeId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  seatIds: string[];

  /**
   * Accepted for compatibility with the client, but the server recomputes
   * the authoritative price from the showtime pricing.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalPrice?: number;
}
