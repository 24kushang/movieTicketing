import { MovieRepository } from '@db/MovieRepository';
import { Movie } from '@models/Movie';

export class MovieService {
  constructor(private repo: MovieRepository) {}

  async createMovie(movie: Movie) {
    return this.repo.create(movie);
  }

  async getMovieById(id: string) {
    return this.repo.getById(id);
  }

  async getAllMovies() {
    return this.repo.getAll();
  }

  async deleteMovie(id: string) {
    return this.repo.delete(id);
  }

  async updateMovie(id: string, updates: Partial<Movie>) {
    return this.repo.update(id, updates);
  }
}