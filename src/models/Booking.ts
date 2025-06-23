export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export class Booking {
  constructor(
    public id: string,
    public showId: string,
    public seatIds: string[],
    public price: number,
    public status: BookingStatus = BookingStatus.PENDING,
    public user?: string
  ) {}

  priceCalculator(basePrice: number, count: number): number {
    return basePrice * count; // Simple calc for now
  }
}