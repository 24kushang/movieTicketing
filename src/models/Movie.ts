import { v4 as uuidv4 } from 'uuid';
export class Movie {
  constructor(
    public id: string = uuidv4(),
    public title: string,
    public duration: number // in minutes
  ) {}

  getDetails(): object {
    return {
      id: this.id,
      title: this.title,
      duration: this.duration
    };
  }

  getTheatres(): string[] {
    return ['Theatre A', 'Theatre B']; // Stubbed for now
  }
}
