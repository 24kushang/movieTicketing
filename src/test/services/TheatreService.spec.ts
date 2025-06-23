import { TheatreService } from "@services/TheatreService";
import { Theatre } from "@models/Theatre";
import { TheatreRepository } from "@db/TheatreRepository";
jest.mock("../../db/TheatreRepository");

describe("TheatreService", () => {
  const repo = new TheatreRepository();

  it("should create a theatre", async () => {
    const theatre: Theatre = new Theatre("1", "Test Theatre", "Location A", 100);

    jest.spyOn(repo, 'create').mockResolvedValue(theatre);
    const service = new TheatreService(repo);
    const result = await service.createTheatre(theatre);
    expect(result).toEqual(theatre);
    expect(repo.create).toHaveBeenCalledWith(theatre);
  });

  it("should get a theatre by ID", async () => {
    const theatre: Theatre = new Theatre("1", "Test Theatre", "Location A", 100);
    jest.spyOn(repo, 'getById').mockResolvedValue(theatre);

    const service = new TheatreService(repo);
    const result = await service.getTheatre("1");

    expect(result).toEqual(theatre);
    expect(repo.getById).toHaveBeenCalledWith("1");
    }
    );
    it("should get all theatres", async () => {
        const theatres: Theatre[] = [
            new Theatre("1", "Theatre A", "Location A", 100),
            new Theatre("2", "Theatre B", "Location B", 150)
        ];
        jest.spyOn(repo, 'getAll').mockResolvedValue(theatres);

        const service = new TheatreService(repo);
        const result = await service.listTheatres();

        expect(result).toEqual(theatres);
        expect(repo.getAll).toHaveBeenCalled();
    }
    );
    it("should delete a theatre", async () => {
        jest.spyOn(repo, 'delete').mockResolvedValue();

        const service = new TheatreService(repo);
        await service.deleteTheatre("1");

        expect(repo.delete).toHaveBeenCalledWith("1");
    });
})