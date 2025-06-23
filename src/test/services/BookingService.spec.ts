import { BookingRepository } from "@db/BookingRepository";
import { BookingService } from "@services/BookingService";
import { Booking, BookingStatus } from "@models/Booking";
import { ShowRepository } from "@db/ShowRepository";
import { Show } from "@models/Show";
jest.mock("../../db/BookingRepository");

describe("BookingService", () => {
  const repo = new BookingRepository();
  const showRepo = new ShowRepository();

  it("should create a booking", async () => {
    const booking: Booking = new Booking(
      "1",
      "show1",
      ["A1", "A2"],
      200,
      BookingStatus.CONFIRMED,
      "user1"
    );
    const show: Show = new Show(
        "show1",
        "movie1",
        "theatre1",
        new Date().toDateString(),
        100,
        []
        );
    jest.spyOn(repo, "create").mockResolvedValue(booking);
    jest.spyOn(showRepo, "getById").mockResolvedValue(show);
    
    const service = new BookingService(repo, showRepo);
    const result = await service.createBooking(booking);
    expect(result).toEqual(booking);
    expect(repo.create).toHaveBeenCalledWith(booking);
    expect(showRepo.getById).toHaveBeenCalledWith("show1");
  });

  it("should get a booking by ID", async () => {
    const booking: Booking = new Booking(
      "1",
      "show1",
      ["A1", "A2"],
      200,
      BookingStatus.CONFIRMED,
      "user1"
    );

    jest.spyOn(repo, "getById").mockResolvedValue(booking);

    const service = new BookingService(repo, showRepo);
    const result = await service.getBooking("1");

    expect(result).toEqual(booking);
    expect(repo.getById).toHaveBeenCalledWith("1");
  });

  it("should cancel a booking", async () => {
    const booking: Booking = new Booking(
      "1",
      "show1",
      ["A1", "A2"],
      200,
      BookingStatus.CONFIRMED,
      "user1"
    );
    const cancelledBooking: Booking = Object.assign({}, booking, {
      status: BookingStatus.CANCELLED,
    });

    jest.spyOn(repo, "getById").mockResolvedValue(booking);
    jest.spyOn(repo, "update").mockResolvedValue(cancelledBooking);

    const service = new BookingService(repo, showRepo);
    const result = await service.cancelBooking("1");

    expect(result).toBe(false); // already cancelled
    expect(repo.getById).toHaveBeenCalledWith("1");
    expect(repo.update).toHaveBeenCalledWith("1", {
      status: BookingStatus.CANCELLED,
    });
  });
});
