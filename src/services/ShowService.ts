import { ShowRepository } from "../db/ShowRepository";
import { Show } from "../models/Show";
import { Seat } from "../models/Seat";

export class ShowService {
  constructor(private repo: ShowRepository) {}

  async listShows(movieId: string): Promise<Show[]> {
    if (movieId) return this.repo.getAllShowsForMovie(movieId);
    return this.repo.getAll();
  }

  // Accepts a partial show payload and generates seats if not provided
  async createShow(data: {
    id?: string;
    movieId: string;
    theatreId: string;
    time: string;
    price: number;
    seats?: any[];
  }): Promise<Show> {
    const seats = Array.isArray(data.seats)
      ? data.seats.map((s) => (s instanceof Object && !(s instanceof Seat) ? Seat.fromJSON(s) : s))
      : Seat.generateSeatMap();
    const show = new Show(
      data.id || '',
      data.movieId,
      data.theatreId,
      data.time,
      data.price,
      seats
    );
    return this.repo.create(show);
  }

  async deleteShow(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async getShow(id: string): Promise<Show | undefined> {
    return this.repo.getById(id);
  }
}