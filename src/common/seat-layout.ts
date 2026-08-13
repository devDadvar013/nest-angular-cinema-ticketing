/**
 * Cinema hall layout shared by showtimes (seat map) and bookings (pricing).
 * The hall has 8 rows (A–H) of 12 seats; rows G and H are VIP.
 */
export const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;
export const SEATS_PER_ROW = 12;
export const VIP_ROWS = new Set<string>(['G', 'H']);

export type SeatStatus = 'available' | 'reserved';

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  vip: boolean;
}

export interface SeatRow {
  row: string;
  seats: Seat[];
}

/** Extract the row letter from a seat id such as "A1" or "H12". */
export function seatRow(seatId: string): string {
  return seatId.replace(/\d+$/, '');
}

/** True when a seat id matches the "row + number" pattern of the hall. */
export function isValidSeatId(seatId: string): boolean {
  return /^[A-H]([1-9]|1[0-2])$/.test(seatId);
}

/** Build the full seat map, marking seats in `reservedSeatIds` as reserved. */
export function buildSeatMap(reservedSeatIds: Set<string>): SeatRow[] {
  return ROW_LABELS.map((row) => ({
    row,
    seats: Array.from({ length: SEATS_PER_ROW }, (_, i) => {
      const number = i + 1;
      const id = `${row}${number}`;
      return {
        id,
        row,
        number,
        vip: VIP_ROWS.has(row),
        status: reservedSeatIds.has(id) ? ('reserved' as const) : ('available' as const),
      };
    }),
  }));
}
