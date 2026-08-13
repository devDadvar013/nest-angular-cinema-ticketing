# Cinema Backend

REST API for the **cinema-ticketing** Angular app, built with **NestJS** and **MongoDB** (Mongoose).

## Requirements

- Node.js 20+
- A running MongoDB instance (local: `mongodb://localhost:27017`)

## Setup

```bash
cd backend
cp .env.example .env   # optional — defaults work out of the box
npm install
npm run start:dev
```

The server listens on `http://localhost:3000` (override with `PORT`) and exposes every
route under the `/api` prefix. On first boot it seeds the movies and showtimes migrated
from the frontend mock data.

## API

### Movies

| Method | Route                 | Description                                    |
| ------ | --------------------- | ---------------------------------------------- |
| GET    | `/api/movies`         | List movies (`?nowShowing=true` filters)       |
| GET    | `/api/movies/:id`     | Get a single movie                             |
| POST   | `/api/movies`         | Create a movie (admin)                         |

### Showtimes

| Method | Route                          | Description                                        |
| ------ | ------------------------------ | -------------------------------------------------- |
| GET    | `/api/showtimes?movieId=:id`   | Showtimes for a movie, sorted by date then time    |
| GET    | `/api/showtimes/:id`           | Get a single showtime (movie is populated)         |
| GET    | `/api/showtimes/:id/seats`     | Seat map (rows A–H × 12, VIP G/H) with reserved seats derived from active bookings |
| POST   | `/api/showtimes`               | Create a showtime (admin)                          |

### Bookings

| Method | Route                     | Description                                        |
| ------ | ------------------------- | -------------------------------------------------- |
| POST   | `/api/bookings`           | Create a booking `{ showtimeId, seatIds }`; rejects occupied seats (409) and recomputes the price server-side |
| GET    | `/api/bookings/:id`       | Get a booking (showtime is populated)              |
| POST   | `/api/bookings/:id/confirm` | Confirm payment (`confirmed: true`)              |
| DELETE | `/api/bookings/:id`       | Cancel a booking and release its seats             |

## Data model

- **movies** — title, originalTitle, genres, durationMin, ageRating, rating, synopsis,
  director, cast, releaseYear, poster gradient colors (`accentFrom`/`accentTo`), nowShowing.
- **showtimes** — movieId (ref), ISO date, time, hall, format (`2D|3D|IMAX|4DX`), basePrice, vipPrice.
- **bookings** — showtimeId (ref), seatIds (e.g. `["A1","G12"]`), totalPrice, referenceCode
  (`CT-XXXXXX`), confirmed, cancelledAt.

Seats are not stored — the hall layout is fixed (8 rows × 12 seats, rows G/H are VIP) and the
`seats` endpoint marks a seat as `reserved` when any non-cancelled booking holds it.

## Frontend integration notes

The Angular app currently reads from in-memory mock services
(`CinemaService` / `BookingService`). To switch it to this API, replace those services with
HTTP calls backed by the routes above; the response shapes match the existing models except
that `id` becomes the Mongo `_id` and bookings use `confirmed` (boolean).
