import { MovieService } from "@services/MovieService";
import { Movie } from "@models/Movie";
import { MovieRepository } from "@db/MovieRepository";

jest.mock("../../db/MovieRepository");

describe("MovieService", ()=>{
    const repo = new MovieRepository();
    it("should create a movie", async () => {
        const movie: Movie = new Movie("1", "Test Movie",120);

        jest.spyOn(repo, 'create').mockResolvedValue(movie);
        const service = new MovieService(repo);
        const result = await service.createMovie(movie);
        expect(result).toEqual(movie);
        expect(repo.create).toHaveBeenCalledWith(movie);
    });
    it("should get a movie by ID", async () => {
        const movie: Movie = new Movie("1", "Test Movie", 120);
        jest.spyOn(repo, 'getById').mockResolvedValue(movie);
        
        const service = new MovieService(repo);
        const result = await service.getMovieById("1");
        
        expect(result).toEqual(movie);
        expect(repo.getById).toHaveBeenCalledWith("1");
    });
    it("should get all movies", async () => {
        const movies: Movie[] = [
            new Movie("1", "Movie A", 120),
            new Movie("2", "Movie B", 150)
        ];
        jest.spyOn(repo, 'getAll').mockResolvedValue(movies);
        
        const service = new MovieService(repo);
        const result = await service.getAllMovies();
        
        expect(result).toEqual(movies);
        expect(repo.getAll).toHaveBeenCalled();
    }); 
    it("should delete a movie", async () => {
        jest.spyOn(repo, 'delete').mockResolvedValue();
        
        const service = new MovieService(repo);
        await service.deleteMovie("1");
        
        expect(repo.delete).toHaveBeenCalledWith("1");
    });
})