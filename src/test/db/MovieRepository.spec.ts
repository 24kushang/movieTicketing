import { MovieRepository } from "@db/MovieRepository";
import { Movie } from "@models/Movie";

describe("MovieRepository", () => {
  let repo: MovieRepository;

  beforeAll(() => {
    repo = new MovieRepository();
  });

  it("should create a movie", async () => {
    const movie: Movie = new Movie("1", "Test Movie", 120);
    const createdMovie = await repo.create(movie);
    expect(createdMovie).toEqual(movie);
  });

  it("should get a movie by id", async () => {
    const movie = await repo.getById("1");
    expect(movie).toBeDefined();
    expect(movie?.id).toBe("1");
  });

  it("should get all movies", async () => {
    const movies = await repo.getAll();
    expect(movies.length).toBeGreaterThan(0);
  });

  it("should update a movie", async () => {
    const updates = { title: "Updated Movie" };
    const updatedMovie = await repo.update("1", updates);
    expect(updatedMovie).toBeDefined();
    expect(updatedMovie?.title).toBe("Updated Movie");
  });

  it("should delete a movie", async () => {
    await repo.delete("1");
    const movie = await repo.getById("1");
    expect(movie).toBeUndefined();
  });
});
