import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsModule } from './bookings/bookings.module';
import { MoviesModule } from './movies/movies.module';
import { SeedModule } from './seed/seed.module';
import { ShowtimesModule } from './showtimes/showtimes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI', 'mongodb://localhost:27017/cinema'),
      }),
    }),
    MoviesModule,
    ShowtimesModule,
    BookingsModule,
    SeedModule,
  ],
})
export class AppModule {}
