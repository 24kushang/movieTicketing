import { ShowRepository } from '@db/ShowRepository';
import { BookingRepository } from '@db/BookingRepository';
import { Booking, BookingStatus } from '@models/Booking';
import { v4 as uuidv4 } from 'uuid';
import { Show } from '@models/Show';
import { Seat } from '@models/Seat';

describe('BookingRepository', () => {
    let bookingRepository: BookingRepository;
    let showRepository: ShowRepository;

    beforeEach(() => {
        bookingRepository = new BookingRepository();
        showRepository = new ShowRepository();
    });

    it('should create a booking', async () => {
        const show = new Show(uuidv4(), 'movie-123', 'theatre-456', new Date().toDateString(), 10.0, Seat.generateSeatMap());
        await showRepository.create(show);

        const booking = new Booking(uuidv4(), show.id, [show.seats[0].id], 100, BookingStatus.PENDING, 'user-123');
        const createdBooking = await bookingRepository.create(booking);
        
        expect(createdBooking).toBeDefined();
        expect(createdBooking.id).toBe(booking.id);
        expect(createdBooking.showId).toBe(booking.showId);
    });

    it('should get a booking by ID', async () => {
        const show = new Show(uuidv4(), 'movie-123', 'theatre-456', new Date().toDateString(), 10.0, Seat.generateSeatMap());
        await showRepository.create(show);

        const booking = new Booking(uuidv4(), show.id, [show.seats[0].id], 100, BookingStatus.PENDING, 'user-123');
        await bookingRepository.create(booking);

        const foundBooking = await bookingRepository.getById(booking.id);
        
        expect(foundBooking).toBeDefined();
        expect(foundBooking?.id).toBe(booking.id);
    });

    it('should list all bookings', async () => {
        const bookings = await bookingRepository.getAll();
        expect(Array.isArray(bookings)).toBe(true);
    });

    it('should cancel a booking', async () => {
        const show = new Show(uuidv4(), 'movie-123', 'theatre-456', new Date().toDateString(), 10.0, Seat.generateSeatMap());
        await showRepository.create(show);

        const booking = new Booking(uuidv4(), show.id, [show.seats[0].id], 100, BookingStatus.PENDING, 'user-123');
        await bookingRepository.create(booking);

        const updatedBooking = await bookingRepository.update(booking.id, { status: BookingStatus.CANCELLED });

        expect(updatedBooking).toBeDefined();
        expect(updatedBooking?.status).toBe(BookingStatus.CANCELLED);
    });

    it('should delete a booking by ID', async () => {
        const show = new Show(uuidv4(), 'movie-123', 'theatre-456', new Date().toDateString(), 10.0, Seat.generateSeatMap());
        await showRepository.create(show);

        const booking = new Booking(uuidv4(), show.id, [show.seats[0].id], 100, BookingStatus.PENDING, 'user-123');
        await bookingRepository.create(booking);

        await bookingRepository.delete(booking.id);

        const foundBooking = await bookingRepository.getById(booking.id);
        expect(foundBooking).toBeUndefined();
    });
});