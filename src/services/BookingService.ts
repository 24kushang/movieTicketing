import { ShowRepository } from '@db/ShowRepository';
import { BookingRepository } from '../db/BookingRepository';
import { Booking, BookingStatus } from '../models/Booking';

export class BookingService {
  constructor(private repo: BookingRepository, private showRepo: ShowRepository) {}

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.repo.getById(id);
  }

  async createBooking(booking: Booking): Promise<Booking> {
    // calculate total price based on seats and show details
    const show = await this.showRepo.getById(booking.showId);
    if (!show) {
      throw new Error('Show not found');
    }
    const totalPrice = show.price * booking.seatIds.length;
    
    // create a final booking object
    const bookingWithPrice = new Booking(
      booking.id,
      booking.showId,
      booking.seatIds,
      totalPrice,
      BookingStatus.CONFIRMED, // default status
      booking.user
    );
    return this.repo.create(bookingWithPrice);
  }

  async cancelBooking(id: string): Promise<boolean> {
    // Implement update logic to set status to CANCELLED
    const booking = await this.repo.getById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    if (booking.status === BookingStatus.CANCELLED) {
      return false; // already cancelled
    }
    booking.status = BookingStatus.CANCELLED;
    await this.repo.update(id, { status: booking.status }); 
    return false;
  }
}