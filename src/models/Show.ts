import { Seat, SeatStatus } from "./Seat";

export class Show {
  constructor(
    public id: string,
    public movieId: string,
    public theatreId: string,
    public time: string,
    public price: number,
    public seats: Seat[] = Seat.generateSeatMap()
  ) {}

  toJSON() {
    return {
      id: this.id,
      movieId: this.movieId,
      theatreId: this.theatreId,
      time: this.time,
      price: this.price,
      seats: this.seats.map((seat) => seat.toJSON()),
    };
  }

  static fromJSON(data: any): Show {
    return new Show(
      data.id,
      data.movieId,
      data.theatreId,
      data.time,
      data.price,
      data.seats.map(Seat.fromJSON)
    );
  }

  getSeatMap(): Seat[] {
    return this.seats;
  }

  blockSeat(seatId: string): boolean {
    const seat = this.seats.find((s) => s.id === seatId);
    if (seat && seat.status === SeatStatus.AVAILABLE) {
      seat.status = SeatStatus.BOOKED;
      return true;
    }
    return false;
  }
}