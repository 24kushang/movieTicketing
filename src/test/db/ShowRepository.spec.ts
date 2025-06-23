import { ShowRepository } from '@db/ShowRepository';
import { Show } from '@models/Show';
import { ShowService } from '@services/ShowService';
import { v4 as uuidv4 } from 'uuid';
import { Seat } from '@models/Seat';

describe('ShowRepository', () => {
    let showRepository: ShowRepository;

    beforeEach(() => {
        showRepository = new ShowRepository();
    });
    it('should create a show', async () => {
        const show: Show = new Show(uuidv4(), 'movie-123', 'theatre-456', new Date().toDateString(), 10.0, Seat.generateSeatMap());
        const createdShow = await showRepository.create(show);
        expect(createdShow).toBeDefined();
        expect(createdShow.id).toBe(show.id);
        expect(createdShow.movieId).toBe(show.movieId);
    });
    it('should get a show by ID', async () => {
        const show: Show = new Show(uuidv4(), 'movie-123', 'theatre-456', new Date().toDateString(), 10.0, Seat.generateSeatMap());
        await showRepository.create(show);
        const foundShow = await showRepository.getById(show.id);
        expect(foundShow).toBeDefined();
        expect(foundShow?.id).toBe(show.id);
    });
    it('should list all shows', async () => {
        const shows = await showRepository.getAll();
        expect(Array.isArray(shows)).toBe(true);
    });
    it('should delete a show by ID', async () => {
        const show: Show = new Show(uuidv4(), 'movie-123', 'theatre-456', new Date().toDateString(), 10.0, Seat.generateSeatMap());
        await showRepository.create(show);
        await showRepository.delete(show.id);
        const foundShow = await showRepository.getById(show.id);
        expect(foundShow).toBeUndefined();
    });
    it('should list shows by movie ID', async () => {
        const id = 'movie-123';
        const show1: Show = new Show(uuidv4(), id, 'theatre-456', new Date().toDateString(), 10.0, Seat.generateSeatMap());
        const show2: Show = new Show(uuidv4(), id, 'theatre-789', new Date().toDateString(), 12.0, Seat.generateSeatMap());
        
        await showRepository.create(show1);
        await showRepository.create(show2);

        const shows = await showRepository.getAllShowsForMovie(id);
        expect(shows).toBeDefined();
        expect(shows.length).toBeGreaterThanOrEqual(2);
        
    });
    // it('should update a show', async () => {
    //     const show: Show = new Show(uuidv4(), 'movie-123', 'theatre-456', new Date().toDateString(), 10.0, Seat.generateSeatMap());
    //     await showRepository.create(show);
        
    //     const updatedData = { price: 15.0 };
    //     const updatedShow = await showRepository.update(show.id, updatedData);
        
    //     expect(updatedShow).toBeDefined();
    //     expect(updatedShow?.id).toBe(show.id);
    //     expect(updatedShow?.price).toBe(15.0);
    // });
});