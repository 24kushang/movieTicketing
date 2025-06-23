import { TheatreRepository } from '../db/TheatreRepository';
import { Theatre } from '../models/Theatre';

export class TheatreService {
  constructor(private repo: TheatreRepository) {}

  async listTheatres(): Promise<Theatre[]> {
    return this.repo.getAll();
  }
  async getTheatre(id: string): Promise<Theatre | undefined> {
    return this.repo.getById(id);
  }

  async createTheatre(theatre: Theatre): Promise<Theatre> {
    return this.repo.create(theatre);
  }

  async updateTheatre(id: string, data: Partial<Theatre>): Promise<Theatre | undefined> {
    // Implement update logic as needed
    return undefined;
  }

  async deleteTheatre(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}