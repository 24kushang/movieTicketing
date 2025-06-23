import { ShowRepository } from "@db/ShowRepository";
import { Show } from "@models/Show";
import { ShowService } from "@services/ShowService";
jest.mock("../../db/ShowRepository");

describe("ShowService", () => {
  const repo = new ShowRepository();

  it("should list shows by movie ID", async () => {
    const shows: Show[] = [
      new Show("1", "movie1", "theatre1", new Date().toDateString(), 10, []),
      new Show("2", "movie1", "theatre2", new Date().toDateString(), 15, []),
      new Show("3", "movie2", "theatre1", new Date().toDateString(), 20, []),
    ];

    jest.spyOn(repo, "getAllShowsForMovie").mockResolvedValue(shows);
    const service = new ShowService(repo);
    const result = await service.listShows("movie1");

    expect(result).toEqual(shows);
    expect(repo.getAllShowsForMovie).toHaveBeenCalledWith("movie1");
  });

  it("should create a show", async () => {
    const show: Show = new Show("1", "movie1", "theatre1", new Date().toDateString(), 10, []);
    jest.spyOn(repo, "create").mockResolvedValue(show);

    const service = new ShowService(repo);
    const result = await service.createShow(show);

    expect(result).toEqual(show);
    expect(repo.create).toHaveBeenCalledWith(show);
  });

  it("should get a show by ID", async () => {
    const show: Show = new Show("1", "movie1", "theatre1", new Date().toDateString(), 10, []);
    jest.spyOn(repo, "getById").mockResolvedValue(show);

    const service = new ShowService(repo);
    const result = await service.getShow("1");

    expect(result).toEqual(show);
    expect(repo.getById).toHaveBeenCalledWith("1");
  });

  it("should delete a show by ID", async () => {
    jest.spyOn(repo, "delete").mockResolvedValue();

    const service = new ShowService(repo);
    await service.deleteShow("1");

    expect(repo.delete).toHaveBeenCalledWith("1");
  });
});
